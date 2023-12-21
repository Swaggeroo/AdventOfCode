import {getDayData} from "../../util/getDayData";

let visitedPositions: Set<string> = new Set<string>();
let walkCache: CacheLine[] = [];

getDayData(2023, 21).then((result: string) => {
    result = "...........\n" +
        ".....###.#.\n" +
        ".###.##..#.\n" +
        "..#.#...#..\n" +
        "....#.#....\n" +
        ".##..S####.\n" +
        ".##..#...#.\n" +
        ".......##..\n" +
        ".##.#.####.\n" +
        ".##..##.##.\n" +
        "...........\n"
    let field: tile[][] = result.trim().split('\n').map((line: string) => line.split('') as tile[]);

    let start: Position = field.flatMap((row, y) => row.map((tile, x): Position | undefined => tile === 'S' ? {x, y} : undefined)).find(Boolean)!;

    walk(field, start, 10)
    console.log(visitedPositions.size);

});

function walk(field: tile[][], pos: Position, stepsLeft: number, extendedMap: Position = {x:0, y:0}): void {
    if (walkCache.find(cacheLine => cacheLine.pos.x === pos.x && cacheLine.pos.y === pos.y && cacheLine.stepsLeft === stepsLeft && cacheLine.extendedMap.x === extendedMap.x && cacheLine.extendedMap.y === extendedMap.y)){
        return;
    }

    walkCache.push({pos: {x: pos.x, y: pos.y}, stepsLeft: stepsLeft, extendedMap: {x: extendedMap.x, y: extendedMap.y}});

    if (stepsLeft === 0){
        visitedPositions.add(`${pos.x},${pos.y},${extendedMap.x},${extendedMap.y}`);
        return;
    }else {
        let newPos: Position = {x: pos.x, y: pos.y};
        newPos.x++;
        let newCombo = getNewPosExtendedCombo(newPos, extendedMap, field);
        if (field[newCombo.pos.y][newCombo.pos.x] !== '#'){
            walk(field, newCombo.pos, stepsLeft - 1, newCombo.extendedMap);
        }

        newPos = {x: pos.x, y: pos.y};
        newPos.x--;
        newCombo = getNewPosExtendedCombo(newPos, extendedMap, field);
        if (field[newCombo.pos.y][newCombo.pos.x] !== '#'){
            walk(field, newCombo.pos, stepsLeft - 1, newCombo.extendedMap);
        }

        newPos = {x: pos.x, y: pos.y};
        newPos.y++;
        newCombo = getNewPosExtendedCombo(newPos, extendedMap, field);
        if (field[newCombo.pos.y][newCombo.pos.x] !== '#'){
            walk(field, newCombo.pos, stepsLeft - 1, newCombo.extendedMap);
        }

        newPos = {x: pos.x, y: pos.y};
        newPos.y--;
        newCombo = getNewPosExtendedCombo(newPos, extendedMap, field);
        if (field[newCombo.pos.y][newCombo.pos.x] !== '#'){
            walk(field, newCombo.pos, stepsLeft - 1, newCombo.extendedMap);
        }
    }
}

function getNewPosExtendedCombo(pos: Position, extendedMap: Position, field: tile[][]): {pos:Position, extendedMap: Position} {
    if (pos.x < 0){
        extendedMap.x--;
        pos.x = field[0].length - 1;
    }
    if (pos.x >= field[0].length){
        extendedMap.x++;
        pos.x = 0;
    }
    if (pos.y < 0){
        extendedMap.y--;
        pos.y = field.length - 1;
    }
    if (pos.y >= field.length){
        extendedMap.y++;
        pos.y = 0;
    }

    return {pos: pos, extendedMap: extendedMap};
}

type tile = '.' | '#' | 'S';

interface Position {
    x: number;
    y: number;
}

interface CacheLine {
    pos: Position;
    extendedMap: Position;
    stepsLeft: number;
}


export {}