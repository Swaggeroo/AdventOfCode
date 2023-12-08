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
    let loopMultiply: LoopMultiply[] = [];

    for (let currentStepIndex: number = 0; currentStepIndex < currentSteps.length; currentStepIndex++) {
        loopMultiply.push(new LoopMultiply(
            Loop.findLoop(currentSteps[currentStepIndex], steps, instructions),
            1
        ));
    }

    //Find LCM of all loopMultiply values
    while (true){
        let smallest: number = Number.MAX_VALUE;
        let smallestIndex: number = -1;

        for (let i: number = 0; i < loopMultiply.length; i++) {
            let value: number = loopMultiply[i].getValue();
            if(value < smallest){
                smallest = value;
                smallestIndex = i;
            }
        }

        loopMultiply[smallestIndex].multiply++;

        let values: Set<number> = new Set(loopMultiply.map((loopMultiply: LoopMultiply) => loopMultiply.getValue()));

        if(values.size === 1){
            console.log(loopMultiply[0].getValue());
            return;
        }
    }
});

interface StepPosition {
    step: Step;
    instructionPosition: number;
}

class LoopMultiply {
    Loop: Loop;
    multiply: number;

    constructor(Loop: Loop, multiply: number){
        this.Loop = Loop;
        this.multiply = multiply;
    }

    getValue(): number {
        return (this.Loop.loopLength * this.multiply) + this.Loop.stepsTillZ;
    }
}

class Loop{
    loopLength: number;
    stepsTillZ: number;

    constructor(loopLength: number, stepsTillZ: number){
        this.loopLength = loopLength;
        this.stepsTillZ = stepsTillZ;
    }

    static findLoop(firstStep: Step, steps: Step[], instructions: string): Loop{
        let stepsSeen: StepPosition[] = [];
        let stepsTillZ: number = 0;
        while (true){
            let instructionList: string[] = instructions.split('');
            for (let instructionIndex = 0; instructionIndex < instructionList.length; instructionIndex++) {
                let stepsTillLoop:number = stepsSeen.findIndex((stepPosition: StepPosition) => {
                    return stepPosition.step === firstStep && stepPosition.instructionPosition === instructionIndex;
                });

                if (stepsTillLoop !== -1) {
                    return new Loop(stepsSeen.length - stepsTillLoop, stepsTillZ);
                }

                stepsSeen.push({
                    step: firstStep,
                    instructionPosition: instructionIndex
                });

                firstStep = firstStep.getNextStep(instructionList[instructionIndex], steps);
            }
        }
    }
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

    getNextStep(instruction: string, steps: Step[]): Step {
        if (instruction === 'L') {
            return Step.search(steps, this.left)!;
        }else if(instruction === 'R'){
            return Step.search(steps, this.right)!;
        }
        throw new Error("Invalid instruction");
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

    static search(steps: Step[], search: string): Step | null {
        let start: number = 0;
        let end: number = steps.length-1;
        let middle: number = Math.floor((start+end)/2);
        while(start <= end){
            if(steps[middle].self === search){
                return steps[middle];
            }else if(steps[middle].self < search){
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