import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import permutation from "./permutation.js";

const { OrderedMap, PriorityQueue, LinkList, Deque } = jsSdsl;

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
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let seeds;
	let pipeline = [];
	let mappings;

	for await (const line of rl) {
		if (!seeds) {
			seeds = line.split(": ")[1].split(" ").map(s => parseInt(s));
		} else {
			if (!line) {
				continue;
			}

			if (line[0] < '0' || line[0] > '9') {
				if (mappings) {
					mappings.sort((a, b) => a[1] - b[1]);
					pipeline.push(mappings);
				}

				mappings = [];
			} else {
				mappings.push(line.split(" ").map(s => parseInt(s)));
			}
		}
	}

	mappings.sort((a, b) => a[1] - b[1]);
	pipeline.push(mappings);

	console.log(pipeline);

	const locations = seeds.map((seed) => {
		console.log(`Seed: ${seed}`);
		return pipeline.reduce((input, mappings) => {
			console.log(mappings);
			for (let i = 0; i < mappings.length; i++) {
				const m = mappings[i];
				if (input >= m[1] && input < (m[1] + m[2])) {
					const mapped = m[0] + input - m[1];
					console.log(`${input} -> ${mapped} with ${m}`);

					return mapped;
				}

				if (input < m[1]) {
					console.log(`${input} -> ${input}`)
					break;
				}
			}
			return input;
		}, seed);
	});

	console.log(seeds);
	console.log(locations);

	console.log(Math.min.apply(Math, locations));
}

processLineByLine();
