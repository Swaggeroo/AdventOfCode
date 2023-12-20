import {getDayData} from "../../util/getDayData";

getDayData(2023, 12).then((result: string) => {
    let solution: number = 0;

    let lines: string[] = result.split('\n').slice(0, -1);

    let rows: Row[] = lines.map((line):Row => new Row(line));

    let counter: number = 0;
    rows.forEach((row: Row) => {
        solution += row.findPossibilities(0, row.springs);
        counter++;
        console.log(counter + '/' + rows.length);
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

    findPossibilities(pos: number, springs: string): number{
        let possibilities: number = 0;
        if (pos === springs.length){
            possibilities += this.isPossible(springs) ? 1 : 0;
        }else {
            if (springs[pos] === '?'){
                possibilities += this.findPossibilities(pos + 1, replaceStringAt(springs, pos, '#'));
                possibilities += this.findPossibilities(pos + 1, replaceStringAt(springs, pos, '.'));
            }else{
                possibilities += this.findPossibilities(pos + 1, springs);
            }
        }

        return possibilities;
    }

    isPossible(springs: string): boolean{
        let junks: string[] = springs.split(/\.+/).filter(junk => junk !== '');

        if(junks.length !== this.brokenJunks.length){
            return false;
        }else{
            for(let i = 0; i < junks.length; i++){
                if(junks[i].length !== this.brokenJunks[i]){
                    return false;
                }
            }
        }
        return true;
    }
}

function replaceStringAt(s: string, index: number, replacement: string) {
    return s.substring(0, index) + replacement + s.substring(index + replacement.length);
}

export {}