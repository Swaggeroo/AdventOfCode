import {getDayData} from "../../getDayData";

let minSum: number = Infinity;
let possibleDirections: PossibleDirections = {up: true, right: true, down: true, left: true};

getDayData(2023, 17).then((result: string) => {
    let grid: Node[][] = result.trim().split('\n').map((line: string) => line.split('').map((num: string): Node => { return {num: parseInt(num), visited: false}}));
    tracePath(grid, 0, {x: 0, y: 0}, 'right', 0);

    console.log(minSum);
});


function tracePath(grid: Node[][], currentSum: number, pos: Position, direction: Direction, continuesSteps: number, recursion = 0){
    console.log(recursion + ' ' + currentSum + ' ' + pos.x + '-' + pos.y);
    if (pos.x < 0 || pos.x >= grid[0].length || pos.y < 0 || pos.y >= grid.length || grid[pos.y][pos.x].visited){
        return;
    }

    currentSum += grid[pos.y][pos.x].num;
    grid[pos.y][pos.x].visited = true;

    if (pos.x === grid[0].length-1 && pos.y === grid.length-1){
        minSum = Math.min(minSum, currentSum);
        return;
    }

    possibleDirections.up = true;
    possibleDirections.right = true;
    possibleDirections.down = true;
    possibleDirections.left = true;

    switch (direction){
        case 'up':
            possibleDirections.down = false;
            break;
        case 'right':
            possibleDirections.left = false;
            break;
        case 'down':
            possibleDirections.up = false;
            break;
        case 'left':
            possibleDirections.right = false;
            break;
    }

    if (continuesSteps >= 3){
        switch (direction){
            case 'up':
                possibleDirections.up = false;
                break;
            case 'right':
                possibleDirections.right = false;
                break;
            case 'down':
                possibleDirections.down = false;
                break;
            case 'left':
                possibleDirections.left = false;
                break;
        }
    }

    if (possibleDirections.up){
        if (direction !== 'up'){
            continuesSteps = 0;
        }
        pos.y--;
        tracePath(grid, currentSum, pos, 'up', continuesSteps+1, recursion+1);
        pos.y++;
    }

    if (possibleDirections.right){
        if (direction !== 'right'){
            continuesSteps = 0;
        }
        pos.x++;
        tracePath(grid, currentSum, pos, 'right', continuesSteps+1, recursion+1);
        pos.x--;
    }

    if (possibleDirections.down){
        if (direction !== 'down'){
            continuesSteps = 0;
        }
        pos.y++;
        tracePath(grid, currentSum, pos, 'down', continuesSteps+1, recursion+1);
        pos.y--;
    }

    if (possibleDirections.left){
        if (direction !== 'left'){
            continuesSteps = 0;
        }
        pos.x--;
        tracePath(grid, currentSum, pos, 'left', continuesSteps+1, recursion+1);
        pos.x++;
    }

    grid[pos.y][pos.x].visited = false;
}

interface Node{
    num: number;
    visited: boolean;
}

interface Position{
    x: number;
    y: number;
}

interface PossibleDirections{
    up: boolean;
    right: boolean;
    down: boolean;
    left: boolean;
}

type Direction = 'up' | 'right' | 'down' | 'left';

export {}