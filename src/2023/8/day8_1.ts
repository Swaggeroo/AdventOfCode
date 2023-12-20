import { getDayData } from "../../util/getDayData";

getDayData(2023,8).then((result: string) => {
    let solution: number = 0;

    let lines: string[] = result.split('\n');
    lines.pop();

    let instructions: string = lines[0];

    lines.shift();
    lines.shift();

    let steps: Step[] = [];

    for (let i: number = 0; i < lines.length; i++) {
        let line: string = lines[i];
        steps.push(new Step(line));
    }

    steps.sort(Step.compare);

    let currentStep: Step = steps[0];

    while (true){
        for (let instruction of instructions.split('')) {
            if (instruction === 'L') {
                currentStep = Step.search(steps, currentStep.left)!;
            }else if(instruction === 'R'){
                currentStep = Step.search(steps, currentStep.right)!;
            }

            solution++;

            if(currentStep.self === 'ZZZ'){
                console.log(solution)
                return;
            }
        }
    }
});

class Step {
    self: string;
    left: string;
    right: string;

    constructor(line: string){
        this.self = line.split('=')[0].trim();
        this.left = line.split('=')[1].trim().split(', ')[0].substring(1);
        this.right = line.split('=')[1].trim().split(', ')[1].substring(0,3);
    }

    static compare(a: Step, b: Step): number {
        if (a.self < b.self) {
            return -1;
        }
        if (a.self > b.self) {
            return 1;
        }
        return 0;
    }

    static search(steps: Step[], self: string): Step | null {
        let start: number = 0;
        let end: number = steps.length-1;
        let middle: number = Math.floor((start+end)/2);
        while(start <= end){
            if(steps[middle].self === self){
                return steps[middle];
            }else if(steps[middle].self < self){
                start = middle+1;
            }else{
                end = middle-1;
            }
            middle = Math.floor((start+end)/2);
        }
        return null;
    }
}

export {}