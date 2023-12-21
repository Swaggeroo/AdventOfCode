import {getDayData} from "../../util/getDayData";

let visitedPositions: Set<string> = new Set<string>();
let walkCache: CacheLine[] = [];

getDayData(2023, 21).then((result: string) => {
    let field: tile[][] = result.trim().split('\n').map((line: string) => line.split('') as tile[]);

    let start: Position = field.flatMap((row, y) => row.map((tile, x): Position | undefined => tile === 'S' ? {x, y} : undefined)).find(Boolean)!;

    walk(field, start, 64)
    console.log(visitedPositions.size);

});

function walk(field: tile[][], pos: Position, stepsLeft: number): void {
    if (walkCache.find(cacheLine => cacheLine.pos.x === pos.x && cacheLine.pos.y === pos.y && cacheLine.stepsLeft === stepsLeft)){
        return;
    }

    walkCache.push({pos: pos, stepsLeft: stepsLeft});

    if (stepsLeft === 0){
        visitedPositions.add(`${pos.x},${pos.y}`);
        return;
    }else {
        if (field[pos.y][pos.x + 1] !== '#'){
            walk(field, {x: pos.x + 1, y: pos.y}, stepsLeft - 1);
        }
        if (field[pos.y][pos.x - 1] !== '#'){
            walk(field, {x: pos.x - 1, y: pos.y}, stepsLeft - 1);
        }
        if (field[pos.y + 1][pos.x] !== '#'){
            walk(field, {x: pos.x, y: pos.y + 1}, stepsLeft - 1);
        }
        if (field[pos.y - 1][pos.x] !== '#'){
            walk(field, {x: pos.x, y: pos.y - 1}, stepsLeft - 1);
        }
    }
}

type tile = '.' | '#' | 'S';

interface Position {
    x: number;
    y: number;
}

interface CacheLine {
    pos: Position;
    stepsLeft: number;
}


export {}