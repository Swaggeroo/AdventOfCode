import {getDayData} from "../../util/getDayData";

getDayData(2023, 15).then((result: string) => {
    console.log(result.trim().split(',').reduce((acc, val) => acc + holidayASCIIStringHelperAlgorithm(val), 0));
});

function holidayASCIIStringHelperAlgorithm(input: string): number{
    return input.split('').reduce((acc, char) =>  ((acc+char.charCodeAt(0)) * 17) % 256, 0);
}

export {}