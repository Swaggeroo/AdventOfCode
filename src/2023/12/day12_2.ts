import {getDayData} from "../../getDayData";

getDayData(2023, 12).then((result: string) => {
    let solution: number = 0;

    let lines: string[] = result.split('\n').slice(0, -1);

    let rows: Row[] = lines.map((line):Row => new Row(line));

    let counter: number = 0;

    for (let i = 0; i < rows.length; i++){
        solution += rows[i].findPossibilities(0, 0);
        counter++;
        console.log(counter + '/' + rows.length);
    }

    console.log(solution);
});

class Row{
    springs: string;
    brokenJunks: number[];
    cache: Cache[] = [];

    constructor(line:string){
        let springs = line.split(' ')[0];
        let brokenJunks = line.split(' ')[1].split(',').map(Number);

        this.springs = Array(5).fill(springs).join('?');
        this.brokenJunks = Array(5).fill(brokenJunks).join(',').split(',').map(Number);
    }

    findPossibilities(pos: number, brokenId: number): number {
        if (this.cache.find(cacheLine => cacheLine.CacheLine.pos === pos && cacheLine.CacheLine.brokenId === brokenId)){
            return this.cache.find(cacheLine => cacheLine.CacheLine.pos === pos && cacheLine.CacheLine.brokenId === brokenId)!.result;
        }

        let result = 0;

        if (pos >= this.springs.length){
            let cacheLine: CacheLine = {pos: pos, brokenId: brokenId};
            let res = brokenId === this.brokenJunks.length ? 1 : 0;
            this.cache.push({CacheLine: cacheLine, result: res});
            return res;
        }

        if(this.springs[pos].match(/[.?]/g)){
            result += this.findPossibilities(pos + 1, brokenId);
        }

        if(brokenId == this.brokenJunks.length){
            let cacheLine: CacheLine = {pos: pos, brokenId: brokenId};
            this.cache.push({CacheLine: cacheLine, result: result});
            return result;
        }

        if (this.springs[pos].match(/[#?]/g) &&
            pos + this.brokenJunks[brokenId] <= this.springs.length &&
            !this.springs.substring(pos, pos + this.brokenJunks[brokenId]).match(/\./) &&
            (pos + this.brokenJunks[brokenId] == this.springs.length || this.springs[pos + this.brokenJunks[brokenId]] !== '#')){

            result += this.findPossibilities(pos + this.brokenJunks[brokenId] + 1, brokenId + 1);
        }

        let cacheLine: CacheLine = {pos: pos, brokenId: brokenId};
        this.cache.push({CacheLine: cacheLine, result: result});
        return result;
    };
}

interface CacheLine{
    pos: number,
    brokenId: number
}

interface Cache{
    CacheLine: CacheLine,
    result: number
}

export {}