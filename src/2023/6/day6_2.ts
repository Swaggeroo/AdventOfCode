import { getDayData } from "../../util/getDayData";

getDayData(2023,6).then((result: string) => {
    let solultion: number = 0;

    let lines: string[] = result.split('\n');
    lines.pop();

    let timesString: string[] = lines[0].split(/\s+/);
    timesString.shift();
    let time: number = timesString.reduce((a: number, b: string) => { return Number(a.toString() + b) }, 0);

    let distancesString: string[] = lines[1].split(/\s+/);
    distancesString.shift();
    let record: number = distancesString.reduce((a: number, b: string) => { return Number(a.toString() + b) }, 0);

    for (let pressTime = 1; pressTime < time; pressTime++) {
        let travelTime = time - pressTime;
        let distance = travelTime * pressTime;
        if (distance > record) {
            solultion++;
        }
    }

    console.log(solultion);
});


export {}