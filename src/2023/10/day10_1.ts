import {getDayData} from "../../getDayData";

getDayData(2023, 10).then((result: string) => {
    let lines: string[] = result.split('\n');
    lines.pop();

    let pipeMaze: PipeMaze = new PipeMaze(lines);

    let startPositon: number[] = pipeMaze.getStartPosition();

    let searchPositions: SearchPosition[] = pipeMaze.getNextPositions(startPositon).map((position: number[]) => {
        return {position: position, source: startPositon};
    });
    let solution: number = 1;

    while (searchPositions[0].position[0] !== searchPositions[1].position[0] || searchPositions[0].position[1] !== searchPositions[1].position[1]) {
        let newSearchPositions: SearchPosition[] = [];
        searchPositions.forEach((searchPosition: SearchPosition) => {
            let pos = pipeMaze.getNextPositions(searchPosition.position).map((position: number[]): SearchPosition => {
                return {position: position, source: searchPosition.position};
            });

            let newPosition = pos.find((position: SearchPosition) => { return position.position[0] !== searchPosition.source[0] || position.position[1] !== searchPosition.source[1]})!;

            newSearchPositions.push(newPosition);
        });
        searchPositions = newSearchPositions;
        solution++;
    }


    console.log(solution);
});

interface SearchPosition {
    position: number[];
    source: number[];
}

interface Directions {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

class PipeMaze {
    pipes: string[][] = [];

    constructor(lines: string[]) {
        this.pipes = lines.map((line: string): string[] => {
            return line.split('');
        });
    }

    getStartPosition(): number[] {
        for (let y = 0; y < this.pipes.length; y++) {
            for (let x = 0; x < this.pipes[y].length; x++) {
                if (this.pipes[y][x] === 'S') {
                    return [y, x];
                }
            }
        }
        return [0, 0];
    }

    getNextPositions(currentPos: number[]): number[][] {
        let nextPositions: number[][] = [];
        let currentSymbol: string = this.pipes[currentPos[0]][currentPos[1]];
        let nextSymbol: string = '';
        let directions: Directions = this.getDirections(currentSymbol);
        // up
        if (this.inBounds([currentPos[0] -1, currentPos[1]]) && directions.up){
            nextSymbol = this.pipes[currentPos[0] - 1][currentPos[1]];
            if (this.getDirections(nextSymbol).down){
                nextPositions.push([currentPos[0] - 1, currentPos[1]]);
            }
        }

        // down
        if (this.inBounds([currentPos[0] + 1, currentPos[1]]) && directions.down){
            nextSymbol = this.pipes[currentPos[0] + 1][currentPos[1]];
            if (this.getDirections(nextSymbol).up){
                nextPositions.push([currentPos[0] + 1, currentPos[1]]);
            }
        }

        // left
        if (this.inBounds([currentPos[0], currentPos[1] - 1]) && directions.left){
            nextSymbol = this.pipes[currentPos[0]][currentPos[1] - 1];
            if (this.getDirections(nextSymbol).right){
                nextPositions.push([currentPos[0], currentPos[1] - 1]);
            }
        }

        // right
        if (this.inBounds([currentPos[0], currentPos[1] + 1]) && directions.right){
            nextSymbol = this.pipes[currentPos[0]][currentPos[1] + 1];
            if (this.getDirections(nextSymbol).left){
                nextPositions.push([currentPos[0], currentPos[1] + 1]);
            }
        }

        return nextPositions;
    }

    private inBounds(position: number[]): boolean {
        return position[0] >= 0 && position[0] < this.pipes.length && position[1] >= 0 && position[1] < this.pipes[0].length;
    }

    getDirections(symbol: string): Directions {
        switch (symbol) {
            case 'S':
                return {up: true, down: true, left: true, right: true};
            case '|':
                return {up: true, down: true, left: false, right: false};
            case '-':
                return {up: false, down: false, left: true, right: true};
            case 'L':
                return {up: true, down: false, left: false, right: true};
            case 'J':
                return {up: true, down: false, left: true, right: false};
            case '7':
                return {up: false, down: true, left: true, right: false};
            case 'F':
                return {up: false, down: true, left: false, right: true};
            default:
                return {up: false, down: false, left: false, right: false};
        }
    }
}

export {}