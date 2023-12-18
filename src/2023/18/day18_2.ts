import {getDayData} from "../../getDayData";
import chalk from 'chalk';

getDayData(2023, 18).then((result: string) => {
    let digInstructions: DigInstructions[] = result.trim().split('\n').map((line: string): DigInstructions => {
        let color: string = line.split(' ')[2].substring(1, line.split(' ')[2].length - 1);
        return {
            direction: convertIntoDirection(color.charAt(color.length - 1)),
            length: parseInt(color.substring(1,color.length - 1),16),
            color: color
        }
    });

    let cur: Position = {x: 0, y: 0};

    let cornerPositions: Position[] = [];
    cornerPositions.push({x:cur.x,y:cur.y});

    let halfMissing = 0;
    let quarterMissing = 0;
    let threeQuarterMissing = 0;

    let lastDirection: Direction = digInstructions[digInstructions.length-1].direction;

    console.log("Start: find min and max")
    for (let i = 0; i < digInstructions.length; i++){
        const instruction = digInstructions[i];
        switch (instruction.direction) {
            case 'up':
                cur.y -= instruction.length;
                break;
            case 'down':
                cur.y += instruction.length;
                break;
            case 'left':
                cur.x -= instruction.length;
                break;
            case 'right':
                cur.x += instruction.length;
                break;
        }

        if((lastDirection === 'up' && instruction.direction === 'right') ||
            (lastDirection === 'left' && instruction.direction === 'up') ||
            (lastDirection === 'down' && instruction.direction === 'left') ||
            (lastDirection === 'right' && instruction.direction === 'down')){
            threeQuarterMissing ++;
        }

        if((lastDirection === 'up' && instruction.direction === 'left') ||
            (lastDirection === 'left' && instruction.direction === 'down') ||
            (lastDirection === 'down' && instruction.direction === 'right') ||
            (lastDirection === 'right' && instruction.direction === 'up')){
            quarterMissing ++;
        }

        lastDirection = instruction.direction;

        halfMissing += instruction.length -1;
        cornerPositions.push({x:cur.x,y:cur.y});
    }

    cornerPositions.push(cornerPositions[1]);


    //Gauss's area formula
    let area: number = 0;

    for (let i = 1; i < cornerPositions.length - 1; i++) {
        let posPrev = cornerPositions[i - 1];
        let posCur = cornerPositions[i];
        let posNext = cornerPositions[i + 1];

        area += (posNext.y - posPrev.y) * posCur.x;
    }

    area = area/2;
    area += halfMissing/2;
    area += quarterMissing/4;
    area += threeQuarterMissing*(3/4);

    console.log(chalk.green(area));
});
function convertIntoDirection(input: string): Direction {
    switch (input) {
        case '3':
            return 'up';
        case '1':
            return 'down';
        case '2':
            return 'left';
        case '0':
            return 'right';
    }

    return 'right';
}
interface Position {
    x: number;
    y: number;
}

interface DigInstructions {
    direction: Direction;
    length: number;
    color: string;
}

type Direction = 'up' | 'down' | 'left' | 'right'

export {}