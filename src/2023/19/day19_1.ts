import {getDayData} from "../../getDayData";

getDayData(2023, 19).then((result: string) => {
    let [workflowInput, partInput] = result.trim().split('\n\n');

    let parts: Part[] = partInput.split('\n').map((line: string) => {
        let [x, m, a, s] = line.substring(1, line.length-1).split(',').map((num: string) => parseInt(num.split('=')[1]));
        return {x, m, a, s};
    });

    let workflows: Workflow[] = workflowInput.split('\n').map((workflow: string) => new Workflow(workflow));

    let solution = 0;

    for(let part of parts){
        let nextAction: Action | End = {
            nextStep: 'in'
        }

        while(isAction(nextAction)){
            let nextStep = (nextAction as Action).nextStep;
            let workflow: Workflow = workflows.find((workflow: Workflow) => workflow.name === nextStep)!;
            nextAction = workflow.nextAction(part);
        }

        if ((nextAction as End).accepted){
            solution += part.x + part.m + part.a + part.s;
        }
    }

    console.log(solution);
});

interface Part {
    x: number;
    m: number;
    a: number;
    s: number;
}

function isAction(action: any): action is Action{
    return action.nextStep !== undefined;
}

class Workflow {
    name: string;
    steps: Step[];

    constructor(rawWorkflow: string) {
        let [name, rawSteps] = rawWorkflow.split('{');
        rawSteps = rawSteps.substring(0, rawSteps.length-1);
        let stepsArray: Step[] = rawSteps.split(',').map((step: string) => {
            if (step.includes(':')){
                return {
                    Category: step.split(/[><]/)[0].trim() as PartCategory,
                    value: Number(step.split(/[><]/)[1].split(':')[0]),
                    greaterThan: step.includes('<'),
                    action: this.stringToAction(step.split(':')[1].trim())
                }
            }else {
                return {
                    Category: null,
                    value: null,
                    greaterThan: null,
                    action: this.stringToAction(step)
                }
            }
        });

        this.name = name;
        this.steps = stepsArray;
    }

    stringToAction(s: string): Action | End {
        let action: Action | End;
        if (s === 'A' || s === 'R'){
            action = {
                accepted: s === 'A'
            }
        }else {
            action = {
                nextStep: s
            }
        }
        return action;
    }

    nextAction(part: Part): Action | End {
        for (let i = 0; i < this.steps.length-1; i++){
            let step = this.steps[i];
            if (step.greaterThan){
                if (this.getValue(part, step.Category!) < step.value!){
                    return step.action;
                }
            }else {
                if (this.getValue(part, step.Category!) > step.value!){
                    return step.action;
                }
            }
        }
        return this.steps[this.steps.length-1].action;
    }

    getValue(part: Part, partCategory: PartCategory): number {
        switch (partCategory) {
            case 'x':
                return part.x;
            case 'm':
                return part.m;
            case 'a':
                return part.a;
            case 's':
                return part.s;
        }
    }
}

interface Step {
    Category: PartCategory | null;
    value: number | null;
    greaterThan: boolean | null;
    action: Action | End;
}

type PartCategory = 'x' | 'm' | 'a' | 's';

interface End {
    accepted: boolean;
}

interface Action {
    nextStep: string;
}

export {}