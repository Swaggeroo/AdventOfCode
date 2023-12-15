import {getDayData} from "../../getDayData";

getDayData(2023, 15).then((result: string) => {
    let solution: number = 0;
    let hashmap = new HolidayASCIIStringHelperManualArrangementProcedure<Lens[]>();

    result.trim().split(',').forEach(line => {
        if (line.split('').find(char => char === '-')){
            let label: string = line.split('-')[0];
            let lenses: Lens[] = hashmap.get(label) || [];

            if (lenses.length === 0){
                return;
            }

            let pos = lenses.findIndex(lens => lens.label === label);
            (pos !== -1) ? lenses.splice(pos, 1) : null;

            if (lenses.length === 0){
                hashmap.delete(label);
            }else{
                hashmap.add(label, lenses);
            }
        }else{
            let label: string = line.split('=')[0];
            let focalLength: number = Number(line.split('=')[1]);

            let lenses: Lens[] = hashmap.get(label) || [];

            if (lenses.length === 0 || lenses.findIndex(lens => lens.label === label) === -1){
                lenses.push({label: label, focalLength: focalLength});
                hashmap.add(label, lenses);
            }else{
                lenses[lenses.findIndex(lens => lens.label === label)].focalLength = focalLength;
                hashmap.add(label, lenses);
            }
        }
    });

    for (let i = 0; i <= 255; i++){
        let lenses: Lens[] = hashmap.getByHash(i) || [];
        if (lenses.length === 0){
            continue;
        }

        solution += lenses.reduce((acc, lens, index) => acc + (i+1)*(index+1)*lens.focalLength, 0);
    }

    console.log(solution);
});

function holidayASCIIStringHelperAlgorithm(input: string): number{
    return input.split('').reduce((acc, char) =>  ((acc+char.charCodeAt(0)) * 17) % 256, 0);
}

class HolidayASCIIStringHelperManualArrangementProcedure<T>{
    map: Record<number, T>

    constructor(){
        this.map = {};
    }

    add(key: string, value: T){
        this.map[holidayASCIIStringHelperAlgorithm(key)] = value;
    }

    get(key: string): T{
        return this.map[holidayASCIIStringHelperAlgorithm(key)];
    }

    getByHash(hash: number): T{
        return this.map[hash];
    }

    getOrDefault(key: string, defaultValue: T): T{
        return this.map[holidayASCIIStringHelperAlgorithm(key)] || defaultValue;
    }

    delete(key: string){
        delete this.map[holidayASCIIStringHelperAlgorithm(key)];
    }

    has(key: string): boolean{
        return this.map.hasOwnProperty(holidayASCIIStringHelperAlgorithm(key));
    }

    clear(){
        this.map = {};
    }

    size(): number{
        return Object.keys(this.map).length;
    }

    keys(): string[]{
        return Object.keys(this.map);
    }

    values(): T[]{
        return Object.values(this.map);
    }
}

interface Lens{
    label: string,
    focalLength: number
}

export {}