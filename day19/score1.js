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

async function processLineByLine() {
	const fileStream = fs.createReadStream(filename);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let dataMode = false;

	const rules = {};

	for await (const line of rl) {
		if (!line) {
			dataMode = true;
			continue;
		}

		if (!dataMode) {
			const [name, rest] = line.split("{");
			const workflow = rest.substring(0, rest.length - 1).split(",").reduce((acc, c) => {
				if (c.includes(":")) {
					const [rest, goto] = c.split(":");
					const prop = rest[0];
					const opr = rest[1];
					const value = parseInt(rest.substring(2));
					acc.rules.push({prop, opr, value, goto});
				} else {
					acc.rules.push({goto: c});
				}
				return acc;
			}, {rules: []});

			rules[name] = workflow;
		}
	}

	function count(ranges, rule) {
		if (rule === "R") {
			return 0;
		}
		if (rule === "A") {
			return Object.values(ranges).reduce((acc, [lo, hi]) => {
				return acc * (hi - lo + 1);
			}, 1);
		}

		const workflow = rules[rule];

		let result = 0;
		let i;
		for (i = 0 ; i < workflow.rules.length; i++) {
			const {prop, opr, value, goto} = workflow.rules[i];
			if (prop === undefined) {
				// last choice
				result += count(ranges, goto);
			} else {
				const currentRange = ranges[prop];

				let lo = currentRange[0];
				let hi = currentRange[1];

				let trueRange;
				let falseRange;

				if (opr === ">") {
					trueRange = [value + 1, hi];
					falseRange = [lo, value];
				} else {
					trueRange = [lo, value - 1];
					falseRange = [value, hi];
				}

				if (trueRange[0] <= trueRange[1]) {
					const copy = Object.assign({}, ranges);
					copy[prop] = trueRange;
					result += count(copy, goto);
				}


				if (falseRange[0] <= falseRange[1]) {
					ranges[prop] = falseRange;
				} else {
					break;
				}
			}
		}

		return result;
	}

	const ranges = "xmas".split("").reduce((acc, c) => {
		acc[c] = [1, 4000];
		return acc;
	}, {});

	console.log(count(ranges, "in"));
}

processLineByLine();
