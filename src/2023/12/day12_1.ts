import {getDayData} from "../../getDayData";

getDayData(2023, 12).then((result: string) => {
    let solution: number = 0;

    let lines: string[] = result.split('\n').slice(0, -1);

    let rows: Row[] = lines.map((line):Row => new Row(line));

    rows.forEach((row: Row) => {
        solution += row.findPossibilities();
    });

    console.log(solution);
});

class Row{
    springs: string;
    brokenJunks: number[];

    constructor(line:string){
        this.springs = line.split(' ')[0];
        this.brokenJunks = line.split(' ')[1].split(',').map(num => Number(num));
    }

    findPossibilities(): number{
        return 0;
    }
}

export {}