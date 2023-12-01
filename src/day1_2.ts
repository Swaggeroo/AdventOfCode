import { getDayData } from "./getDayData";

getDayData(2023,1).then((result: string) => {
    let solution :number = 0;

    let lines: string[] = result.split('\n');
    lines.pop();

    let first: string = "-1";
    let last: string = "-1";

    lines.forEach((line: string) => {
        for (let i: number = 0; i < line.length; i++) {
            if(line[i].match(/[0-9]/)){
                if(first === "-1"){
                    first = line[i];
                }else{
                    last = line[i];
                }
            }else if(line.length - i >= 3){
                let testResult = testFoWrittenNumber(line, i);

                if (testResult !== "-1") {
                    if(first === "-1"){
                        first = testResult;
                    }else{
                        last = testResult;
                    }
                }
            }
        }

        if(last === "-1"){
            last = first;
        }
        solution += Number((first + "") + (last + ""));

        first = "-1";
        last = "-1";
    });

    console.log(solution);
});

function testFoWrittenNumber(line: string, i: number): string {
    if (line.substring(i, i + 3) === "one") {
        return "1";
    } else if (line.substring(i, i + 3) === "two") {
        return "2";
    } else if (line.substring(i, i + 5) === "three") {
        return "3";
    } else if (line.substring(i, i + 4) === "four") {
        return "4";
    } else if (line.substring(i, i + 4) === "five") {
        return "5";
    } else if (line.substring(i, i + 3) === "six") {
        return "6";
    } else if (line.substring(i, i + 5) === "seven") {
        return "7";
    } else if (line.substring(i, i + 5) === "eight") {
        return "8";
    } else if (line.substring(i, i + 4) === "nine") {
        return "9";
    }

    return "-1";
}

export {}