import {getDayData} from "../../util/getDayData";

getDayData(2023, 13).then((result: string) => {
    console.log(
        result.trim().split('\n\n')
        .map((pattern: string) => new Pattern(pattern))
        .reduce((acc: number, pattern: Pattern) => acc + pattern.getMirrorValue(), 0)
    );
});

class Pattern{
    tiles: string[][];

    constructor(pattern: string){
        this.tiles = pattern.split('\n').map((line: string) => line.split(''));
    }

    getMirrorValue(): number{
        for (let x = 0; x <= this.tiles[0].length-2; x++){
            let errors: number = 0;
            for (let xTest = x; xTest >= 0; xTest--){
                for (let y = 0; y < this.tiles.length; y++){
                    errors += this.tiles[y][x+x-xTest+1] &&
                        this.tiles[y][xTest] !== this.tiles[y][x+x-xTest+1] ? 1 : 0;
                }
            }
            if (errors === 1){
                return x+1;
            }
        }

        for (let y = 0; y <= this.tiles.length-2; y++){
            let errors: number = 0;
            for (let yTest = y; yTest >= 0; yTest--){
                for (let x = 0; x < this.tiles[0].length; x++){
                    errors += this.tiles[y+y-yTest+1] &&
                        this.tiles[yTest][x] !== this.tiles[y+y-yTest+1][x] ? 1 : 0;
                }
            }
            if (errors === 1){
                return (y+1)*100;
            }
        }

        return 0;
    }
}

export {}