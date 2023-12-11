import {getDayData} from "../../getDayData";

getDayData(2023, 11).then((result: string) => {
    const universe: Universe = new Universe(result);

    const positions: Position[] = universe.getGalaxyPositions();

    const combinations: Combination[] = positions.flatMap((position, index) => {
        return positions.slice(index+1).map(w => {
            return { position1: position, position2: w}
        });
    });

    const distances: number[] = combinations.map(combination => {
        return Math.abs(combination.position1.x - combination.position2.x) + Math.abs(combination.position1.y - combination.position2.y);
    });

    console.log(distances.reduce((a, b) => a + b, 0));
});

class Universe {
    space: Space[][] = [];

    constructor(input: string) {
        const lines = input.split('\n');
        lines.pop();
        for (let line of lines) {
            const space: Space[] = [];
            for (let char of line) {
                space.push({option: char === '#' ? 'galaxy' : 'empty'});
            }
            this.space.push(space);
        }

        this.expand();
    }

    private expand() {
        for (let i = 0; i < this.space.length; i++) {
            if (this.space[i].every(space => space.option === 'empty')) {
                //add line with empty space
                this.space.splice(i, 0, this.space[i].map(() => ({option: 'empty'})));
                i++;
            }
        }

        for (let i = 0; i < this.space[0].length; i++) {
            if (this.space.every(line => line[i].option === 'empty')) {
                //add column with empty space
                for (let line of this.space) {
                    line.splice(i, 0, {option: 'empty'});
                }
                i++;
            }
        }
    }

    getGalaxyPositions(): Position[] {
        const positions: Position[] = [];
        for (let y = 0; y < this.space.length; y++) {
            for (let x = 0; x < this.space[y].length; x++) {
                if (this.space[y][x].option === 'galaxy') {
                    positions.push({x, y});
                }
            }
        }
        return positions;
    }
}

interface Position {
    x: number,
    y: number
}

interface Combination {
    position1: Position,
    position2: Position
}

type Space = {
    option: 'galaxy' | 'empty'
}

export {}