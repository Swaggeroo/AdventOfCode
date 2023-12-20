import {getDayData} from "../../util/getDayData";

getDayData(2023, 11).then((result: string) => {
    const universe: Universe = new Universe(result);

    const positions: Position[] = universe.getGalaxyPositions();

    const combinations: Combination[] = positions.flatMap((position, index) =>
        positions.slice(index + 1).map(w => ({position1: position, position2: w}))
    );

    const expansionPointsY: number[] = universe.getExpansionPointsY();
    const expansionPointsX: number[] = universe.getExpansionPointsX();

    const distances: number[] = combinations.map(combination => {
        const pos1 = combination.position1;
        const pos2 = combination.position2;

        let distance = Math.abs(combination.position1.x - combination.position2.x) + Math.abs(combination.position1.y - combination.position2.y);
        distance += expansionPointsX.filter(x => Math.min(pos1.x, pos2.x) < x && Math.max(pos1.x, pos2.x) > x).length * 999999;
        distance += expansionPointsY.filter(y => Math.min(pos1.y, pos2.y) < y && Math.max(pos1.y, pos2.y) > y).length * 999999;

        return distance;
    });

    console.log(distances.reduce((a, b) => a + b, 0));
});

class Universe {
    space: Space[][] = [];

    constructor(input: string) {
        this.space = input.split('\n').slice(0, -1).map(line =>
            Array.from(line).map(char => ({option: char === '#' ? 'galaxy' : 'empty'}))
        );
    }

    getGalaxyPositions(): Position[] {
        return this.space.reduce((positions: Position[], row: Space[], y: number) => {
            row.forEach((space: Space, x: number) => {
                if (space.option === 'galaxy') {
                    positions.push({x, y});
                }
            });
            return positions;
        }, []);
    }

    getExpansionPointsY(): number[] {
        return this.space
            .map((row, i) => row.every(space => space.option === 'empty') ? i : -1)
            .filter(i => i !== -1);
    }

    getExpansionPointsX() {
        return this.space[0]
            .map((_, i) => this.space.every(row => row[i].option === 'empty') ? i : -1)
            .filter(i => i !== -1);
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