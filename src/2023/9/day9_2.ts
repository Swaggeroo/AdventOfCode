import { getDayData } from "../../getDayData";

getDayData(2023, 9).then((result: string) => {
    let solution: number = 0;

    let lines = result.split('\n');
    lines.pop();

    let data: DataLine[][] = [];

    let iniDataLines = lines.map((line: string): DataLine => {
        let dataLine:number[] = line.split(' ').map((number: string) => parseInt(number));
        return {numbers:dataLine};
    });

    for (let i = 0; i < iniDataLines.length; i++) {
        data.push([]);
        data[i].push(iniDataLines[i]);
    }

    for (let i = 0; i < data.length; i++) {
        let currentLine: DataLine = data[i][0];
        let allZero: boolean = false;
        while (!allZero) {
            let newLine: DataLine = {numbers:[]};
            for (let j = 0; j <= currentLine.numbers.length-2; j++) {
                newLine.numbers.push(currentLine.numbers[j+1] - currentLine.numbers[j]);
            }
            if (newLine.numbers.every((number: number) => number === 0)) {
                allZero = true;
            }
            currentLine = newLine;
            data[i].push(newLine);
        }
    }

    for (let i = 0; i < data.length; i++) {
        let currentSet: DataLine[] = data[i];

        let nextNumber: number = 0;
        for (let j = currentSet.length-2; j >= 0; j--) {
            nextNumber = currentSet[j].numbers[0] - nextNumber;
        }

        solution += nextNumber;
    }

    console.log(solution);
});

interface DataLine{
    numbers: number[];
}

export {}