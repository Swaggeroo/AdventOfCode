import {getDayData} from "../../getDayData";

getDayData(2023, 13).then((result: string) => {
    let patterns: Pattern[] = result.trim().split('\n\n').map((pattern: string) => new Pattern(pattern));

    console.log(patterns.reduce((acc: number, pattern: Pattern) => acc + pattern.getMirrorValue(), 0));
});

class Pattern{
    tiles: string[][];

    constructor(pattern: string){
        this.tiles = pattern.split('\n').map((line: string) => line.split(''));
    }

    getMirrorValue(): number{
        for (let x = 0; x <= this.tiles[0].length-2; x++){
            let isEquals: boolean = true;
            for (let xTest = x; xTest >= 0; xTest--){
                for (let y = 0; y < this.tiles.length; y++){
                    if (x+x-xTest+1 < this.tiles[0].length &&
                        this.tiles[y][xTest] !== this.tiles[y][x+x-xTest+1]) {
                        isEquals = false;
                    }
                }
            }
            if (isEquals){
                return x+1;
            }
        }

        for (let y = 0; y <= this.tiles.length-2; y++){
            let isEquals: boolean = true;
            for (let yTest = y; yTest >= 0; yTest--){
                for (let x = 0; x < this.tiles[0].length; x++){
                    if (y+y-yTest+1 < this.tiles.length &&
                        this.tiles[yTest][x] !== this.tiles[y+y-yTest+1][x]){
                        isEquals = false;
                    }
                }
            }
            if (isEquals){
                return (y+1)*100;
            }
        }

        return 0;
    }
}

export {}