import { getDayData } from "../../util/getDayData";

getDayData(2023,5).then((result: string) => {
    let seeds: Seed[] = [];

    let lines: string[] = result.split('\n');

    let seedsPair: number[] = lines[0].split(':')[1].split(' ').map((seed: string) => { return Number(seed) });
    seedsPair.shift();
    for (let i: number = 0; i < seedsPair.length; i+=2) {
        seeds.push({
            start: seedsPair[i],
            length: seedsPair[i+1]
        });
    }

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

    let lastSeedMap: SeedMap = seedMaps[seedMaps.length-1];
    lastSeedMap.maps.sort((a: rangeNumberMap, b: rangeNumberMap) => {
        return a.destination - b.destination;
    });

    for (let i: number = 0; i < lastSeedMap.maps.length; i++) {
        let rangeNumberMap: rangeNumberMap = lastSeedMap.maps[i];
        for (let j: number = 0; j < rangeNumberMap.length; j++) {
            let seedSource: number = rangeNumberMap.source + j;
            min = rangeNumberMap.destination + j;

            for (let seedMapIndex: number = seedMaps.length-2; seedMapIndex >= 0; seedMapIndex--) {
                let seedMap: SeedMap = seedMaps[seedMapIndex];
                for (let numberMapsIndex: number = 0; numberMapsIndex < seedMap.maps.length; numberMapsIndex++) {
                    let numberMap: rangeNumberMap = seedMap.maps[numberMapsIndex];
                    if(seedSource >= numberMap.destination && seedSource < numberMap.destination + numberMap.length){
                        seedSource = numberMap.source + (seedSource - numberMap.destination);
                        break;
                    }
                }
            }

            for (let seedIndex: number = 0; seedIndex < seeds.length; seedIndex++) {
                let seed: Seed = seeds[seedIndex];
                if(seed.start <= seedSource && seed.start + seed.length > seedSource){
                    console.log(min);
                    return;
                }
            }
        }
    }

    console.log("Not found");
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

interface Seed{
    start: number,
    length: number
}

export {}