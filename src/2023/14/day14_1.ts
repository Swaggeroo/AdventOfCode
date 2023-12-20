import {getDayData} from "../../util/getDayData";

getDayData(2023, 14).then((result: string) => {
    let platform: Platform = new Platform(result.trim());

    platform.tiltNorth();
    console.log(platform.getLoadNorthBeam());
});

class Platform{
    space: string[][];

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

    tiltNorth(): void{
        for (let x = 0; x < this.space[0].length; x++){
            for (let y = 0; y < this.space.length; y++){
                if (this.space[y][x] === '.'){
                    for (let yTest = y; yTest < this.space.length; yTest++){
                        if (this.space[yTest][x] === '#'){
                            break;
                        }else if (this.space[yTest][x] === 'O'){
                            this.space[y][x] = 'O';
                            this.space[yTest][x] = '.';
                            break;
                        }
                    }
                }
            }
        }
    }
}

export {}