import {getDayData} from "../../getDayData";

getDayData(2023, 9).then((result: string) => {
    let lines = result.split('\n');
    lines.pop();

    let iniDataLines: DataLine[] = lines.map((line: string): DataLine => {
        return new DataLine(line);
    });

    let dataSets: DataSet[] = [];

    iniDataLines.forEach((dataLine: DataLine) => {
        dataSets.push(new DataSet(dataLine))
    });

    dataSets.forEach((dataSet: DataSet) => {
        dataSet.fillDataLines()
    });

    console.log(dataSets.reduce((acc: number, dataSet: DataSet) => acc + dataSet.extrapolate(false), 0));
});

class DataLine {
    numbers: number[];

    constructor(line: string) {
        this.numbers = line.split(' ').map((number: string) => parseInt(number));
    }
}

class DataSet {
    dataLines: DataLine[] = [];

    constructor(dataLines: DataLine) {
        this.dataLines.push(dataLines);
    }

    fillDataLines() {
        let currentLine: DataLine = this.dataLines[0];
        let newLine: DataLine = {numbers: []};
        do {
            newLine = {numbers: []};
            for (let j = 0; j <= currentLine.numbers.length - 2; j++) {
                newLine.numbers.push(currentLine.numbers[j + 1] - currentLine.numbers[j]);
            }
            currentLine = newLine;
            this.dataLines.push(newLine);
        } while (!newLine.numbers.every((number: number) => number === 0));
    }

    extrapolate(right: boolean): number {
        let nextNumber: number = 0;
        for (let j = this.dataLines.length - 2; j >= 0; j--) {
            if (right) {
                nextNumber += this.dataLines[j].numbers[this.dataLines[j].numbers.length - 1];
            } else {
                nextNumber = this.dataLines[j].numbers[0] - nextNumber;
            }
        }

        return nextNumber;
    }
}

export {}