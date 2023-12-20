import { getDayData } from "../../util/getDayData";

getDayData(2023,3).then((result: string) => {
    let solultion: number = 0;

    let lines: string[] = result.split('\n');
    lines.pop();

    let numberPositions: NumberPosition[] = [];
    let symbolPositions: Position[] = [];

    for (let i: number = 0; i < lines.length; i++) {
        let line: string = lines[i];
        let x: number = 0;
        while (x < line.length) {
            if (line[x].match(/\d/)){
                let start: number = x;
                let end: number = x;
                let number: number = Number(line[x]);
                while (x+1 < line.length && line[x+1].match(/\d/)) {
                    number = number * 10 + Number(line[x+1]);
                    end = x+1;
                    x++;
                }

                numberPositions.push({
                    number: number,
                    position: {
                        line: i,
                        start: start,
                        end: end
                    }
                });
            }else if(line[x] == '*'){
                symbolPositions.push({
                    line: i,
                    start: x,
                    end: x
                });
            }

            x++;
        }
    }

    for (let i: number = 0; i < symbolPositions.length; i++) {
        let symbolPosition: Position = symbolPositions[i];
        let adjacentNumbers: number[] = [];
        for (let j: number = 0; j < numberPositions.length; j++) {
            let numberPosition: NumberPosition = numberPositions[j];

            let position: Position = numberPosition.position;

            let boundingBoxYStart: number = position.line-1;
            let boundingBoxXStart: number = position.start-1;
            let boundingBoxYEnd: number = position.line+1;
            let boundingBoxXEnd: number = position.end+1;

            if(symbolPosition.line >= boundingBoxYStart && symbolPosition.line <= boundingBoxYEnd && symbolPosition.start >= boundingBoxXStart && symbolPosition.end <= boundingBoxXEnd){
                adjacentNumbers.push(numberPosition.number);
            }
        }

        if(adjacentNumbers.length === 2){
            solultion += adjacentNumbers[0] * adjacentNumbers[1];
        }
    }

    console.log(solultion);
});

interface Position {
    line: number;
    start: number;
    end: number;
}

interface NumberPosition {
    number: number;
    position: Position;
}

export {}