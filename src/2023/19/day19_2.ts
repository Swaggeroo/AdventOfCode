import {getDayData} from "../../util/getDayData";
import fs from "node:fs";

//Output Visualisation
//Paste output from visu/19_2.txt into https://sankeymatic.com/build/

getDayData(2023, 19).then((result: string) => {
    let workflows: Workflow[] = result.trim().split('\n\n')[0]
        .split('\n')
        .map((workflow: string) => new Workflow(workflow));

    let parts: PartPossibility = {
        x: [1, 4000],
        m: [1, 4000],
        a: [1, 4000],
        s: [1, 4000]
    }

    let startWorkflow = workflows.find((workflow: Workflow) => workflow.name === 'in')!;

    console.log(Workflow.getPossibilities(workflows, startWorkflow, parts));
});

interface PartPossibility {
    x: number[];
    m: number[];
    a: number[];
    s: number[];
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

    static getPossibilities(workflows: Workflow[], current: Workflow, possible: PartPossibility): number{
        let steps = current.steps;

        let total = 0;

        for (let step of steps){
            if (step.Category !== null){
                if (step.greaterThan!){
                    //val max is less than step.value
                    //skip if isn't possible - if val min is greater or equal than step.value
                    if (this.getValue(possible, step.Category, true) >= step.value!){
                        continue;
                    }
                }else {
                    //val min is more than step.value
                    //skip if isn't possible if val min is less or equal than step.value
                    if (this.getValue(possible, step.Category, false) <= step.value!) {
                        continue;
                    }
                }

                let newPossible: PartPossibility = this.copyPossible(possible);
                this.setValue(newPossible, step.Category, !step.greaterThan!, step.greaterThan! ? step.value!-1 : step.value!+1);
                if (isAction(step.action)){
                    this.visualizePossibilities(current.name, this.getTotalPossibilities(newPossible), (step.action as Action).nextStep);
                    total += this.getPossibilities(workflows, workflows.find((workflow: Workflow) => workflow.name === (step.action as Action).nextStep)!, newPossible);
                }else if(step.action.accepted){
                    this.visualizePossibilities(current.name, this.getTotalPossibilities(newPossible), 'A');
                    total += this.getTotalPossibilities(newPossible);
                }else {
                    this.visualizePossibilities(current.name, this.getTotalPossibilities(newPossible), 'R');
                }

                this.setValue(possible, step.Category, step.greaterThan!, step.value!);
            }else {
                if (!isAction(step.action) && step.action.accepted){
                    this.visualizePossibilities(current.name, this.getTotalPossibilities(possible), 'A');
                    total += this.getTotalPossibilities(possible);
                }else if (isAction(step.action)){
                    this.visualizePossibilities(current.name, this.getTotalPossibilities(possible), (step.action as Action).nextStep);
                    total += this.getPossibilities(workflows, workflows.find((workflow: Workflow) => workflow.name === (step.action as Action).nextStep)!, possible);
                }else{
                    this.visualizePossibilities(current.name, this.getTotalPossibilities(possible), 'R');
                }
            }
        }

        return total;
    }

    static visualizePossibilities(src: string, possibilities: number, to: string): void{
        fs.appendFileSync('./visu/19_2.txt', `${src} [${possibilities}] ${to}\n`);
    }

    static copyPossible(possible: PartPossibility): PartPossibility{
        return {
            x: [possible.x[0], possible.x[1]],
            m: [possible.m[0], possible.m[1]],
            a: [possible.a[0], possible.a[1]],
            s: [possible.s[0], possible.s[1]]
        }
    }

    static getTotalPossibilities(possible: PartPossibility): number{
        return (possible.x[1] - possible.x[0] + 1) * (possible.m[1] - possible.m[0] + 1) * (possible.a[1] - possible.a[0] + 1) * (possible.s[1] - possible.s[0] + 1);
    }

    static getValue(part: PartPossibility, category: PartCategory, min: boolean): number {
        switch (category) {
            case 'x':
                return part.x[min ? 0 : 1];
            case 'm':
                return part.m[min ? 0 : 1];
            case 'a':
                return part.a[min ? 0 : 1];
            case 's':
                return part.s[min ? 0 : 1];
        }
    }

    static setValue(part: PartPossibility, category: PartCategory, min: boolean, value: number): void {
        switch (category) {
            case 'x':
                part.x[min ? 0 : 1] = value;
                break;
            case 'm':
                part.m[min ? 0 : 1] = value;
                break;
            case 'a':
                part.a[min ? 0 : 1] = value;
                break;
            case 's':
                part.s[min ? 0 : 1] = value;
                break;
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