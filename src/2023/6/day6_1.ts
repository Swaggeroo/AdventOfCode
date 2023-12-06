import { getDayData } from "../../getDayData";

getDayData(2023,6).then((result: string) => {
    let solultion: number = 1;

    let lines: string[] = result.split('\n');
    lines.pop();

    let timesString: string[] = lines[0].split(/\s+/);
    timesString.shift();
    let times: number[] = timesString.map((time: string) => { return Number(time) });

    let distancesString: string[] = lines[1].split(/\s+/);
    distancesString.shift();
    let distances: number[] = distancesString.map((distance: string) => { return Number(distance) });

    for (let i: number = 0; i < times.length; i++) {
        let time: number = times[i];
        let record: number = distances[i];
        let possibleRecordBreaking: number = 0;

        for (let pressTime = 1; pressTime < time; pressTime++) {
            let travelTime = time - pressTime;
            let distance = travelTime * pressTime;
            if (distance > record) {
                possibleRecordBreaking++;
            }
        }

        solultion *= possibleRecordBreaking;
    }

    console.log(solultion);
});


export {}