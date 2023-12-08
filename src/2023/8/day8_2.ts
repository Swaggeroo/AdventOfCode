import { getDayData } from "../../getDayData";

getDayData(2023,8).then((result: string) => {
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

    let currentSteps: Step[] = Step.getNodesEndingWithA(steps);
    let loops: Loops[] = [];

    for (let i: number = 0; i < currentSteps.length; i++) {
        let stepsSeen: StepPosition[] = [];
        let looping: boolean = true;
        let stepsTillZ: number = 0;
        while (looping){
            let instructionList: string[] = instructions.split('');
            for (let u = 0; u < instructionList.length && looping; u++) {
                let instruction: string = instructionList[u];
                for (let j: number = 0; j < stepsSeen.length; j++) {
                    if(stepsSeen[j].step === currentSteps[i] && stepsSeen[j].instructionPosition === u){
                        loops.push({
                            startOfLoop: j,
                            loopLength: stepsSeen.length - j,
                            stepsTillZ: stepsTillZ
                        });
                        looping = false;
                        break;
                    }
                }

                stepsSeen.push({
                    step: currentSteps[i],
                    instructionPosition: u
                });

                if (instruction === 'L') {
                    currentSteps[i] = Step.search(steps, currentSteps[i].left)!;
                }else if(instruction === 'R'){
                    currentSteps[i] = Step.search(steps, currentSteps[i].right)!;
                }
            }
        }
    }

    let loopMultiply: LoopMultiply[] = [];
    loops.forEach((loop: Loops) => {
        loopMultiply.push({
            Loop: loop,
            multiply: 1
        });
    });

    console.log("Starting loop multiply");
    while (true){
        let smallest = Number.MAX_VALUE;
        let smallestIndex = -1;
        for (let i: number = 0; i < loopMultiply.length; i++) {
            let value: number = (loopMultiply[i].Loop.loopLength * loopMultiply[i].multiply) + loopMultiply[i].Loop.stepsTillZ;
            if(value < smallest){
                smallest = value;
                smallestIndex = i;
            }
        }

        loopMultiply[smallestIndex].multiply++;

        let allEqual: boolean = true;
        let firstValue: number = (loopMultiply[0].Loop.loopLength * loopMultiply[0].multiply) + loopMultiply[0].Loop.stepsTillZ;
        for (let i: number = 1; i < loopMultiply.length; i++) {
            let value: number = (loopMultiply[i].Loop.loopLength * loopMultiply[i].multiply) + loopMultiply[i].Loop.stepsTillZ;
            if(value !== firstValue){
                allEqual = false;
                break;
            }
        }

        if(allEqual){
            console.log(firstValue);
            return;
        }
    }
});

interface StepPosition {
    step: Step;
    instructionPosition: number;
}

interface Loops {
    startOfLoop: number;
    loopLength: number;
    stepsTillZ: number;
}

interface LoopMultiply {
    Loop: Loops;
    multiply: number;
}

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

    static getNodesEndingWithA(steps: Step[]): Step[] {
        let nodes: Step[] = [];
        steps.forEach((step: Step) => {
            if(step.self.substring(step.self.length-1) === 'A'){
                nodes.push(step);
            }
        });
        return nodes;
    }
}

export {}