import {getDayData} from "../../util/getDayData";

getDayData(2023, 22).then((result: string) => {
    throw new Error("Not working yet");

    let bricks: Brick[] = result.trim().split("\n").map((line: string): Brick => {
        let parts = line.split("~");
        let start = parts[0].split(",").map((s: string) => parseInt(s));
        let end = parts[1].split(",").map((s: string) => parseInt(s));
        return new Brick({x: start[0], y: start[1], z: start[2]}, {x: end[0], y: end[1], z: end[2]});
    });

    bricks.sort(Brick.compare);

    bricks.forEach((brick: Brick) => {brick.fallToTheGround(bricks)});

    let solution = 0;

    for (let brick of bricks) {
        let canBeRemoved = true;
        for (let support of brick.supports) {
            if (support.dependencies.length <= 1) {
                canBeRemoved = false;
                break;
            }
        }
        solution += canBeRemoved ? 1 : 0;
    }

    console.log(solution);
});

interface Position {
    x: number;
    y: number;
    z: number;
}

class Brick {
    start: Position;
    end: Position;
    dependencies: Brick[];
    supports: Brick[];

    constructor(start: Position, end: Position) {
        this.start = start;
        this.end = end;
        this.dependencies = [];
        this.supports = [];
    }

    static compare(b1: Brick, b2: Brick): number {
        return Math.min(b1.start.z, b1.end.z) <= Math.min(b2.start.z, b2.end.z) ? -1 : 1;
    }

    fallToTheGround(bricks: Brick[]): void {
        // Lower z till something is hit
        let z = Math.min(this.start.z, this.end.z);
        while (z > 1 && this.dependencies.length === 0) {
            for (let testBrick of bricks) {
                if (testBrick === this) {
                    continue;
                }
                let maxZ = Math.max(testBrick.start.z, testBrick.end.z);

                if (maxZ+1 === z && (intersects(this.start.x, this.start.y, this.end.x, this.end.y, testBrick.start.x, testBrick.start.y, testBrick.end.x, testBrick.end.y) || linePoint(this.start.x, this.start.y, this.end.x, this.end.y, testBrick.start.x, testBrick.start.y) || linePoint(testBrick.start.x, testBrick.start.y, testBrick.end.x, testBrick.end.y, this.end.x, this.end.y) || (testBrick.start.x === this.start.x && testBrick.start.y === this.start.y))) {
                    this.dependencies.push(testBrick);
                    testBrick.supports.push(this);
                }
            }

            if (this.dependencies.length === 0) {
                this.start.z--;
                this.end.z--;
                z = Math.min(this.start.z, this.end.z);
            }
        }
    }
}

function intersects(a: number,b: number,c: number,d: number,p: number,q: number,r: number,s: number): boolean {
    let det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1);
    }
}

function linePoint(x1: number, y1: number, x2: number, y2: number, px: number,  py: number): boolean {

    // get distance from the point to the two ends of the line
    let d1 = dist(px,py, x1,y1);
    let d2 = dist(px,py, x2,y2);

    // get the length of the line
    let lineLen = dist(x1,y1, x2,y2);

    // since floats are so minutely accurate, add
    // a little buffer zone that will give collision
    let buffer = 0;    // higher # = less accurate

    // if the two distances are equal to the line's
    // length, the point is on the line!
    // note we use the buffer here to give a range,
    // rather than one #
    if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
        return true;
    }
    return false;
}

function dist(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
}

export {}