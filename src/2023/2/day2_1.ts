import { getDayData } from "../../getDayData";

getDayData(2023,2).then((result: string) => {
    let solution :number = 0;

    let lines: string[] = result.split('\n');
    lines.pop();

    let games: Game[] = [];

    //Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green

    for (let i: number = 0; i < lines.length; i++) {
        let line: string = lines[i];
        let game: Game = {
            id: Number(line.split(':')[0].split(' ')[1]),
            pulls: []
        };

        let pulls: string[] = line.split(':')[1].split('; ');
        pulls[0] = pulls[0].substring(1);
        for (let j: number = 0; j < pulls.length; j++) {
            game.pulls.push(parsePull(pulls[j]));
        }

        games.push(game);
    }

    for (let i: number = 0; i < games.length; i++) {
        let game: Game = games[i];
        let red: number = 0;
        let green: number = 0;
        let blue: number = 0;
        game.pulls.forEach((pull: Pull) => {
            if (pull.red > red) {
                red = pull.red;
            }
            if (pull.green > green) {
                green = pull.green;
            }
            if (pull.blue > blue) {
                blue = pull.blue;
            }
        });

        if(red <= 12 && green <= 13 && blue <= 14){
            solution += game.id;
        }
    }

    console.log(solution);
});

function parsePull(pull: string): Pull {
    let pullObject: Pull = {
        red: 0,
        green: 0,
        blue: 0
    };

    let colors: string[] = pull.split(', ');

    colors.forEach((color: string) => {
        let number: number = Number(color.split(' ')[0]);
        if (color.substring(color.length - 4) === "blue") {
            pullObject.blue = number;
        }else if (color.substring(color.length - 3) === "red") {
            pullObject.red = number;
        }else if (color.substring(color.length - 5) === "green") {
            pullObject.green = number;
        }
    });

    return pullObject;
}

interface Game {
    id: number;
    pulls: Pull[];
}

interface Pull {
    red: number;
    green: number;
    blue: number;
}

export {}