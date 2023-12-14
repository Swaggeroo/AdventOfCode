import {getDayData} from "../../getDayData";

getDayData(2023, 14).then((result: string) => {

    let platform: Platform = new Platform(result.trim());

    for (let i = 0; i < 1000000000; i++){
        let spaceCache = platform.spinCache.find((cacheLine: CacheLine) => arraysAreEqual(cacheLine.space, platform.space));
        if (spaceCache){
            let cacheIndex = ((1000000000 - spaceCache.pos) % (i - spaceCache.pos))+spaceCache.pos;
            platform.space = platform.spinCache.find((cacheLine: CacheLine) => cacheLine.pos === cacheIndex)!.space;
            break;
        }else{
            platform.spinCycle(i);
        }
    }

    console.log(platform.getLoadNorthBeam());
});

class Platform{
    space: string[][];
    spinCache: CacheLine[] = [];

    constructor(input: string){
        this.space = input.split('\n').map((line: string) => line.split(''));
    }

    getLoadNorthBeam(): number{
        let load: number = 0;
        for (let y = 0; y < this.space.length; y++){
            for (let x = 0; x < this.space[0].length; x++){
                if (this.space[y][x] === 'O'){
                    load += this.space.length - y;
                }
            }
        }
        return load;
    }

    spinCycle(pos: number): void{
        let cacheLine: CacheLine = {
            space: this.space.map(subArray => [...subArray]),
            newSpace: [],
            pos: pos
        };
        this.tiltNorth();
        this.tiltWest();
        this.tiltSouth();
        this.tiltEast();
        cacheLine.newSpace = this.space.map(subArray => [...subArray]);
        this.spinCache.push(cacheLine);
    }

    tiltNorth(): void {
        for (let x = 0; x < this.space[0].length; x++) {
            for (let y = 0; y < this.space.length; y++) {
                if (this.space[y][x] === '.') {
                    let yTest = this.space.slice(y).findIndex(cell => cell[x] === 'O' || cell[x] === '#');
                    if (yTest !== -1 && this.space[y + yTest][x] === 'O') {
                        this.space[y][x] = 'O';
                        this.space[y + yTest][x] = '.';
                    }
                }
            }
        }
    }

    tiltSouth(): void {
        for (let x = 0; x < this.space[0].length; x++) {
            for (let y = this.space.length - 1; y >= 0; y--) {
                if (this.space[y][x] === '.') {
                    let yTest = this.space.slice(0, y + 1).reverse().findIndex(cell => cell[x] === 'O' || cell[x] === '#');
                    if (yTest !== -1 && this.space[y - yTest][x] === 'O') {
                        this.space[y][x] = 'O';
                        this.space[y - yTest][x] = '.';
                    }
                }
            }
        }
    }

    tiltEast(): void {
        for (let y = 0; y < this.space.length; y++) {
            for (let x = this.space[0].length - 1; x >= 0; x--) {
                if (this.space[y][x] === '.') {
                    let xTest = this.space[y].slice(0, x + 1).reverse().findIndex(cell => cell === 'O' || cell === '#');
                    if (xTest !== -1 && this.space[y][x - xTest] === 'O') {
                        this.space[y][x] = 'O';
                        this.space[y][x - xTest] = '.';
                    }
                }
            }
        }
    }

    tiltWest(): void {
        for (let y = 0; y < this.space.length; y++) {
            for (let x = 0; x < this.space[0].length; x++) {
                if (this.space[y][x] === '.') {
                    let xTest = this.space[y].slice(x).findIndex(cell => cell === 'O' || cell === '#');
                    if (xTest !== -1 && this.space[y][x + xTest] === 'O') {
                        this.space[y][x] = 'O';
                        this.space[y][x + xTest] = '.';
                    }
                }
            }
        }
    }
}

function arraysAreEqual(array1: any[][], array2: any[][]): boolean {
    if (array1.length !== array2.length) {
        return false;
    }

    for (let i = 0; i < array1.length; i++) {
        if (array1[i].length !== array2[i].length) {
            return false;
        }

        for (let j = 0; j < array1[i].length; j++) {
            if (array1[i][j] !== array2[i][j]) {
                return false;
            }
        }
    }

    return true;
}

interface CacheLine{
    space: string[][];
    newSpace: string[][];
    pos: number;
}

export {}