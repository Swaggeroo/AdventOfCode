import { getDayData } from "../../getDayData";

getDayData(2023,5).then((result: string) => {
    let seeds: number[];

    let lines: string[] = result.split('\n');

    seeds = lines[0].split(':')[1].split(' ').map((seed: string) => { return Number(seed) });
    seeds.shift();

    lines.shift();
    lines.shift();

    let seedMaps: SeedMap[] = [];
    for (let i: number = 0; i < lines.length; i++) {
        let seedMap: SeedMap = {
            source: lines[i].split(' ')[0].split('-to-')[0],
            destination: lines[i].split(' ')[0].split('-to-')[1],
            maps: []
        }
        i++;

        while (lines[i] !== ''){
            let line: string = lines[i];
            let rangeNumberMap: rangeNumberMap = {
                source: Number(line.split(' ')[1]),
                destination: Number(line.split(' ')[0]),
                length: Number(line.split(' ')[2])
            }

            seedMap.maps.push(rangeNumberMap);
            i++;
        }

        seedMaps.push(seedMap);
    }

    let min: number = Number.MAX_VALUE;

    seeds.forEach((seed: number) => {
        for (let i: number = 0; i < seedMaps.length; i++) {
            let seedMap: SeedMap = seedMaps[i];
            for (let j: number = 0; j < seedMap.maps.length; j++) {
                let rangeNumberMap: rangeNumberMap = seedMap.maps[j];
                if(seed >= rangeNumberMap.source && seed < rangeNumberMap.source + rangeNumberMap.length){
                    seed = rangeNumberMap.destination + (seed - rangeNumberMap.source);
                    break;
                }
            }
        }
        if (seed < min) min = seed;
    });

    console.log(min);
});

interface SeedMap {
    destination: string,
    source: string,
    maps: rangeNumberMap[]
}

interface rangeNumberMap {
    source: number,
    destination: number,
    length: number
}

export {}