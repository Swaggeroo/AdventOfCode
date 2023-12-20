import {getDayData} from "../../util/getDayData";
import {Queue} from "../../util/Queue";

let lowSignals: number = 0;
let highSignals: number = 0;

getDayData(2023, 20).then((result: string) => {
    let rawModules = result.trim().split('\n').map((line: string) => line.split(' -> ')[0]);
    let rawConnections = result.trim().split('\n').map((line: string) => line.split(' -> ')[1]);

    let modules: Module[] = rawModules.map((rawModule: string) => {
        switch (rawModule.charAt(0)){
            case '%':
                return new FlipFlop(rawModule.substring(1));
            case '&':
                return new Conjunction(rawModule.substring(1));
            case 'b':
                return new Broadcast(rawModule);
            default:
                throw new Error('Unknown module type');
        }
    });

    rawConnections.forEach((rawConnection: string, i) => {
        let connections = rawConnection.split(', ');
        let fromModule = modules[i];
        connections.forEach((connection: string) => {
            let toModule = modules.find((module: Module) => module.name === connection);
            if (!toModule){
                toModule = new End(connection);
            }
            fromModule.setOutput(toModule);
        });
    });

    modules.forEach((module: Module) => {
        if (module instanceof Conjunction){
            rawConnections.forEach((rawConnection: string, i) => {
                if (rawConnection.split(', ').includes(module.name)){
                    module.addInput(modules[i]);
                }
            });
        }
    });

    let startModule = modules.find((module: Module) => module instanceof Broadcast)!;

    for (let i = 0; i < 1000; i++){
        let queue: Queue<Signal> = new Queue<Signal>();
        queue.enqueue({src: startModule, dst: startModule, receivedSignal: false});
        lowSignals++;
        while (queue.size() > 0){
            let currentSignal = queue.dequeue()!;
            sendSignals(queue, currentSignal);
        }
    }

    console.log(lowSignals * highSignals);
});

function sendSignals(queue: Queue<Signal>, currentSignal: Signal): void {
    if (currentSignal.dst instanceof End){
        return;
    }

    currentSignal.dst.receiveSignal(currentSignal.receivedSignal, currentSignal.src)

    let sendingSignal = currentSignal.dst.sendSignal();

    if (sendingSignal !== null){
        currentSignal.dst.outputs.forEach((module: Module) => {
            sendingSignal! ? highSignals++ : lowSignals++;
            queue.enqueue({
                src: currentSignal.dst,
                dst: module,
                receivedSignal: sendingSignal!
            });
        });
    }
}

abstract class Module {
    currentState: boolean = false;
    name: string;
    outputs: Module[] = [];
    signalIsSend: boolean = false;

    protected constructor(name: string){
        this.name = name;
    }

    setOutput(module: Module): void {
        this.outputs.push(module);
    }

    abstract receiveSignal(high: boolean, input: Module): void;
    abstract sendSignal(): boolean | null;
}

class FlipFlop extends Module {
    constructor(name: string){
        super(name);
    }

    receiveSignal(high: boolean, input: Module): void {
        if (!high){
            this.currentState = !this.currentState;
            this.signalIsSend = true;
        }
    }

    sendSignal(): boolean | null {
        if (this.signalIsSend){
            this.signalIsSend = false;
            return this.currentState;
        }
        return null;
    }
}

class Conjunction extends Module {
    receivedSignals: ReceivedSignal[] = [];

    constructor(name: string){
        super(name);
        this.signalIsSend = true;
    }

    receiveSignal(high: boolean, input: Module): void {
        this.receivedSignals.find((signal: ReceivedSignal) => signal.input === input)!.receivedSignal = high;

        this.currentState = this.receivedSignals.every((signal: ReceivedSignal) => signal.receivedSignal);
    }

    addInput(module: Module): void {
        this.receivedSignals.push({
            input: module,
            receivedSignal: false
        });
    }

    sendSignal(): boolean {
        return !this.currentState;
    }
}

class Broadcast extends Module {
    constructor(name: string){
        super(name);
        this.signalIsSend = true;
    }

    receiveSignal(high: boolean, input: Module): void {
        this.currentState = high;
    }

    sendSignal(): boolean {
        return this.currentState;
    }
}

class End extends Module {
    constructor(name: string){
        super(name);
    }

    receiveSignal(high: boolean, input: Module): void {}

    sendSignal(): boolean {
        return false;
    }
}

interface ReceivedSignal {
    input: Module;
    receivedSignal: boolean;
}

interface Signal {
    src: Module;
    dst: Module;
    receivedSignal: boolean;
}

export {}