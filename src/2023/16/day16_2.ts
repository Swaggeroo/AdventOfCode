import {getDayData} from "../../getDayData";

getDayData(2023, 16).then((result: string) => {
    let solution: number = 0;

    let field: Tile[][] = getField(result);
    
    let workingField: Tile[][] = getField(result);
    traceLightBeam(workingField, {x: 0, y: 0}, 'right');
    solution = Math.max(solution, getEnergizedTiles(workingField));
    workingField = getField(result);

    traceLightBeam(workingField, {x: 0, y: 0}, 'down');
    solution = Math.max(solution, getEnergizedTiles(workingField));
    workingField = getField(result);

    for (let x = 1; x <= field[0].length-2; x++){
        traceLightBeam(workingField, {x: x, y: 0}, 'down');
        solution = Math.max(solution, getEnergizedTiles(workingField));
        workingField = getField(result);
    }

    traceLightBeam(workingField, {x: field[0].length-1, y: 0}, 'left');
    solution = Math.max(solution, getEnergizedTiles(workingField));
    workingField = getField(result);

    traceLightBeam(workingField, {x: field[0].length-1, y: 0}, 'down');
    solution = Math.max(solution, getEnergizedTiles(workingField));
    workingField = getField(result);

    for (let y = 1; y <= field.length-2; y++){
        traceLightBeam(workingField, {x: field[0].length-1, y: y}, 'left');
        solution = Math.max(solution, getEnergizedTiles(workingField));
        workingField = getField(result);
    }

    traceLightBeam(workingField, {x: field[0].length-1, y: field.length-1}, 'up');
    solution = Math.max(solution, getEnergizedTiles(workingField));
    workingField = getField(result);

    traceLightBeam(workingField, {x: field[0].length-1, y: field.length-1}, 'left');
    solution = Math.max(solution, getEnergizedTiles(workingField));
    workingField = getField(result);

    for (let x = field[0].length-2; x >= 1; x--){
        traceLightBeam(workingField, {x: x, y: field.length-1}, 'up');
        solution = Math.max(solution, getEnergizedTiles(workingField));
        workingField = getField(result);
    }

    traceLightBeam(workingField, {x: 0, y: field.length-1}, 'right');
    solution = Math.max(solution, getEnergizedTiles(workingField));
    workingField = getField(result);

    traceLightBeam(workingField, {x: 0, y: field.length-1}, 'up');
    solution = Math.max(solution, getEnergizedTiles(workingField));
    workingField = getField(result);

    for (let y = field.length-2; y >= 1; y--){
        traceLightBeam(workingField, {x: 0, y: y}, 'right');
        solution = Math.max(solution, getEnergizedTiles(workingField));
        workingField = getField(result);
    }

    console.log(solution);
});

function getField(input: string): Tile[][]{
    return input.trim().split('\n')
        .map((line: string) => line.split(''))
        .map((line: string[]) => line.map((tile: string):Tile => {
            return {type: tile, energized: false, directionsTaken: {up: false, right: false, down: false, left: false}}
        }));
}

function getEnergizedTiles(field: Tile[][]): number{
    let solution: number = 0;
    for (let y = 0; y < field.length; y++){
        for (let x = 0; x < field[0].length; x++){
            if (field[y][x].energized) {
                solution++;
            }
        }
    }
    return solution;
}

function traceLightBeam(field: Tile[][], pos: Position, direction: Direction){
    if (pos.x < 0 || pos.x >= field[0].length || pos.y < 0 || pos.y >= field.length){
        return;
    }

    field[pos.y][pos.x].energized = true;
    switch (direction){
        case 'up':
            field[pos.y][pos.x].directionsTaken.up = true;
            break;
        case 'right':
            field[pos.y][pos.x].directionsTaken.right = true;
            break;
        case 'down':
            field[pos.y][pos.x].directionsTaken.down = true;
            break;
        case 'left':
            field[pos.y][pos.x].directionsTaken.left = true;
            break;
    }

    switch (field[pos.y][pos.x].type){
        case '/':
            switch (direction){
                case 'up':
                    direction = 'right';
                    break;
                case 'right':
                    direction = 'up';
                    break;
                case 'down':
                    direction = 'left';
                    break;
                case 'left':
                    direction = 'down';
                    break;
            }
            break;
        case '\\':
            switch (direction){
                case 'up':
                    direction = 'left';
                    break;
                case 'right':
                    direction = 'down';
                    break;
                case 'down':
                    direction = 'right';
                    break;
                case 'left':
                    direction = 'up';
                    break;
            }
            break;
        case '|':
            if (direction === 'left' || direction === 'right'){
                field[pos.y][pos.x].directionsTaken.left = true;
                field[pos.y][pos.x].directionsTaken.right = true;
                traceLightBeam(field, {x: pos.x, y: pos.y-1}, 'up');
                traceLightBeam(field, {x: pos.x, y: pos.y+1}, 'down');
                return;
            }
            break;
        case '-':
            if (direction === 'up' || direction === 'down'){
                field[pos.y][pos.x].directionsTaken.up = true;
                field[pos.y][pos.x].directionsTaken.down = true;
                traceLightBeam(field, {x: pos.x-1, y: pos.y}, 'left');
                traceLightBeam(field, {x: pos.x+1, y: pos.y}, 'right');
                return;
            }
            break;
        default:
            break;
    }

    //next tile
    switch (direction){
        case 'up':
            pos.y--;
            break;
        case 'right':
            pos.x++;
            break;
        case 'down':
            pos.y++;
            break;
        case 'left':
            pos.x--;
            break;
    }

    if (pos.x < 0 || pos.x >= field[0].length || pos.y < 0 || pos.y >= field.length){
        return;
    }

    if (field[pos.y][pos.x].energized &&
        ((field[pos.y][pos.x].directionsTaken.down && direction == 'down') ||
        (field[pos.y][pos.x].directionsTaken.up && direction == 'up') ||
        (field[pos.y][pos.x].directionsTaken.left && direction == 'left') ||
        (field[pos.y][pos.x].directionsTaken.right && direction == 'right'))){
        return;
    }

    traceLightBeam(field, pos, direction);
}

interface Tile{
    type: string;
    energized: boolean;
    directionsTaken: Directions;
}

type Direction = 'up' | 'right' | 'down' | 'left';

interface Directions{
    up: boolean;
    right: boolean;
    down: boolean;
    left: boolean;
}

interface Position{
    x: number;
    y: number;
}

export {}