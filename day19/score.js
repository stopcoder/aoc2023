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
	let data = []

	for await (const line of rl) {
		if (!line) {
			dataMode = true;
			continue;
		}

		if (!dataMode) {
			const [name, rest] = line.split("{");
			const conditions = rest.substring(0, rest.length - 1).split(",");
			const testFns = conditions.map((c) => {
				let next;
				let test;
				if (c.includes(":")) {
					const parts = c.split(":");
					next = parts[1];
					test = parts[0];
				} else {
					next = c;
				}

				if (test) {
					return function(o) {
						const p = test[0];
						const operator = test[1];
						const value = parseInt(test.substring(2));
						if (o.hasOwnProperty(p)) {
							if (operator === "<") {
								return o[p] < value ? next : false;
							} else {
								return o[p] > value ? next : false;
							}
						}
					};
				} else {
					return function(o) {
						return next;
					};
				}
			});

			rules[name] = testFns;
		} else {
			data.push(line.substring(1, line.length -1).split(",").reduce((acc, part) => {
				const name = part[0];
				const value = parseInt(part.substring(2));
				acc[name] = value;
				return acc;
			}, {}));
		}
	}

	data = data.filter(o => {
		let result;
		let rule = "in";
		let testFns = rules[rule];
		let index = 0;

		while (result !== "A" && result !== "R") {
			result = testFns[index](o);
			if (result === false) {
				index++;
			} else {
				console.log(result)
				testFns = rules[result];
				index = 0;
			}
		}

		return result === "A";
	});

	const result = data.reduce((acc, o) => {
		return acc + Object.keys(o).reduce((acc, k) => acc + o[k], 0);
	}, 0);


	console.log(result);
}

processLineByLine();
