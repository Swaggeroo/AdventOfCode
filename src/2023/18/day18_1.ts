import {getDayData} from "../../util/getDayData";
import chalk from 'chalk';
import {createCanvas} from "canvas";
import fs from "node:fs";

getDayData(2023, 18).then((result: string) => {
    let digInstructions: DigInstructions[] = result.trim().split('\n').map((line: string): DigInstructions => {
        return {
            direction: convertIntoDirection(line.split(' ')[0]),
            length: parseInt(line.split(' ')[1]),
            color: line.split(' ')[2].substring(1, line.split(' ')[2].length - 1)
        }
    });

    let cur: Position = {x: 0, y: 0};

    let min: Position = {x: 0, y: 0};
    let max: Position = {x: 0, y: 0};

    digInstructions.forEach(instruction => {
        switch (instruction.direction) {
            case 'up':
                cur.y -= instruction.length;
                min.y = Math.min(min.y, cur.y);
                break;
            case 'down':
                cur.y += instruction.length;
                max.y = Math.max(max.y, cur.y);
                break;
            case 'left':
                cur.x -= instruction.length;
                min.x = Math.min(min.x, cur.x);
                break;
            case 'right':
                cur.x += instruction.length;
                max.x = Math.max(max.x, cur.x);
                break;
        }
    });

    let grid: Grid = new Grid(min,max);

    grid.setColors(digInstructions);
    grid.fillBorder();
    grid.save();

    console.log(chalk.green(grid.getNotDigged()));
});
function convertIntoDirection(input: string): Direction {
    switch (input) {
        case 'U':
            return 'up';
        case 'D':
            return 'down';
        case 'L':
            return 'left';
        case 'R':
            return 'right';
    }

    return 'right';
}

interface DigSite {
    x: number;
    y: number;
    color: string;
}

class Grid {
    digSites: DigSite[][] = [];
    min: Position;
    max: Position;

    constructor(min: Position, max: Position) {
        this.min = min;
        this.max = max;
        for (let i = 0; i < max.y - min.y + 1; i++) {
            this.digSites.push([]);
            for (let j = 0; j < max.x - min.x + 1; j++) {
                this.digSites[i].push({x: j + min.x, y: i + min.y, color: '#000000'});
            }
        }
    }

    setColors(digInstructions: DigInstructions[]) {
        let x = 0;
        let y = 0;
        for (let i = 0; i < digInstructions.length; i++) {
            const instruction = digInstructions[i];
            switch (instruction.direction) {
                case 'up':
                    for (let j = 1; j <= instruction.length; j++) {
                        this.digSites[y - this.min.y - j][x - this.min.x].color = instruction.color;
                    }
                    y -= instruction.length;
                    break;
                case 'down':
                    for (let j = 1; j <= instruction.length; j++) {
                        this.digSites[y - this.min.y + j][x - this.min.x].color = instruction.color;
                    }
                    y += instruction.length;
                    break;
                case 'left':
                    for (let j = 1; j <= instruction.length; j++) {
                        this.digSites[y - this.min.y][x - this.min.x - j].color = instruction.color;
                    }
                    x -= instruction.length;
                    break;
                case 'right':
                    for (let j = 1; j <= instruction.length; j++) {
                        this.digSites[y - this.min.y][x - this.min.x + j].color = instruction.color;
                    }
                    x += instruction.length;
                    break;
            }

            if (x > this.max.x || x < this.min.x || y > this.max.y || y < this.min.y) {
                break;
            }

        }
    }

    fillBorder() {
        for (let i = 0; i < this.digSites.length; i++) {
            this.floodFill({x: 0, y: i});
            this.floodFill({x: this.digSites[0].length - 1, y: i});
        }

        for (let i = 1; i < this.digSites[0].length - 1; i++) {
            this.floodFill({x: i, y: 0});
            this.floodFill({x: i, y: this.digSites.length - 1});
        }
    }

    floodFill(pos: Position) {
        if (pos.x < 0 ||
            pos.x >= this.digSites[0].length ||
            pos.y < 0 ||
            pos.y >= this.digSites.length ||
            this.digSites[pos.y][pos.x].color !== '#000000'
        ) {
            return;
        }

        this.digSites[pos.y][pos.x].color = '#ffffff';
        pos.x -= 1;
        this.floodFill(pos);
        pos.x += 1;

        pos.x += 1;
        this.floodFill(pos);
        pos.x -= 1;

        pos.y -= 1;
        this.floodFill(pos);
        pos.y += 1;

        pos.y += 1;
        this.floodFill(pos);
        pos.y -= 1;
    }

    getNotDigged(): number {
        let result: number = 0;
        for (let x = 0; x < this.digSites[0].length; x++) {
            for (let y = 0; y < this.digSites.length; y++) {
                result += this.digSites[y][x].color !== '#ffffff' ? 1 : 0;
            }
        }
        return result;
    }

    save(){
        let width: number = this.digSites[0].length;
        let height: number = this.digSites.length;

        const canvas = createCanvas(width, height);
        const context = canvas.getContext("2d");

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                context.fillStyle = this.digSites[y][x].color;
                context.fillRect(x, y, 1, 1);
            }
        }

        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./visu/day18_1.png", buffer);
    }
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