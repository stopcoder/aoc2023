import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import permutation from "./permutation.js";

const { OrderedMap, PriorityQueue, LinkList, Deque } = jsSdsl;
const filename = "input";

/*
const arr = [1, 2, 3, 4, 5];
const que = new PriorityQueue(
    // initialize the incoming arr, the complexity of doing so is O(n)
    arr,
    // this will create a small root heap, the default is a large root heap
    (x, y) => x - y
);
console.log(que.pop());
*/

/*
const graph = {
	a: {b: 10, c: 100, d: 1},
	b: {c: 10},
	d: {b: 1, e: 1},
	e: {f: 1},
	f: {c: 1},
	g: {b: 1}
};
// All paths from 'a'
const paths = single_source_shortest_paths(graph, 'a');
console.log(paths);
*/

class Module {
	static register = new Map();
	static pipeline = [];
	constructor(name, outputs) {
		this.outputs = outputs
		this.name = name;

		Module.register.set(this.name, this);
	}

	onSignal(bHigh, from) {
	}

	static getModuleByName(name) {
		return Module.register.get(name);
	}
}

class BroadCaster extends Module {
	constructor(outputs) {
		super("broadcaster", outputs);
	}

	onSignal(bHigh, from) {
		this.outputs.forEach(name => {
			const m = Module.register.get(name);
			Module.pipeline.push([m || name, bHigh, this.name]);
		});
	}
}

class FlipFlop extends Module {
	#on = false;

	onSignal(bHigh, from) {
		if (!bHigh) {
			this.#on = !this.#on;
			this.outputs.forEach(name => {
				const m = Module.register.get(name);
				Module.pipeline.push([m || name, this.#on, this.name]);
			});
		}
	}
}

class Conjunction extends Module {
	#state = new Map();
	inputs = [];

	onSignal(bHigh, from) {
		this.#state.set(from, bHigh);

		const pulse = ![...this.#state.values()].every(high => high);

		this.outputs.forEach(name => {
			const m = Module.register.get(name);
			Module.pipeline.push([m || name, pulse, this.name]);
		})
	}

	addInput(name) {
		this.inputs.push(name);
		this.#state.set(name, false);
	}
}

async function processLineByLine() {
	const fileStream = fs.createReadStream(filename);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const conNames = [];

	for await (const line of rl) {
		if (line.includes("broadcaster")) {
			const [_, p2] = line.split(" -> ");
			const outputs = p2.split(", ");

			new BroadCaster(outputs);
		} else if (line.startsWith("%")) {
			//Flipflop
			const [name, p2] = line.substring(1).split(" -> ");
			const outputs = p2.split(", ");
			new FlipFlop(name, outputs);
		} else if (line.startsWith("&")) {
			const [name, p2] = line.substring(1).split(" -> ");
			const outputs = p2.split(", ")
			new Conjunction(name, outputs);
			conNames.push(name);
		}
	}

	conNames.forEach(conName => {
		const conInstance = Module.getModuleByName(conName);
		for (const [name, instance] of Module.register) {
			if (instance.outputs.includes(conName)) {
				conInstance.addInput(name);
			}
		}
	});


	let count = 0;
	const inputs = "ch gh sv th".split(" ");
	const cache = {};

	let found = false;
	while (true) {
		count++;
		Module.pipeline = [[Module.getModuleByName("broadcaster"), false, "button"]];

		while (Module.pipeline.length) {
			const [instance, highPulse, from] = Module.pipeline.shift();
			// console.log(`${from} sends ${highPulse? "high" : "low"} pulse to ${instance.name ? instance.name : instance}`);
		
			if (instance.name === "cn" && highPulse) {
				cache[from] ??= [];
				cache[from].push(count);
			}

			if (inputs.every(name => cache[name] && cache[name].length > 5)) {
				found = true;
				break;
			}

			if (instance instanceof Module) {
				instance.onSignal(highPulse, from);
			}
		}

		if (found) {
			break;
		}
	}

	console.log(inputs.reduce((acc, name) => acc * cache[name][0], 1));
}

processLineByLine();
