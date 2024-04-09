import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import permutation from "./permutation.js";
import lcm from "compute-lcm";

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

	let steps;
	let graph = {};

	for await (const line of rl) {
		if (!steps) {
			steps = line.split("").map(char => char === "L" ? 0 : 1);
			continue;
		}

		if (!line) {
			continue;
		}

		const parts = line.split(" = ");
		const edges = parts[1].substring(1, parts[1].length - 1).split(", ");

		graph[parts[0]] = edges;
	}


	function test(s) {
		return s[s.length - 1] === "Z";
	}

	let nodes = Object.keys(graph).filter(s => s[s.length - 1] === "A");
	console.log(nodes);


	let counts = nodes.map((node) => {
		console.log(`start: ${node}`)
		let i = 0;
		while (!test(node)) {
			const dir = steps[i % steps.length];
			node = graph[node][dir];
			i++;
		}
		console.log(`end: ${node}`)
		return i;
	});

	console.log(counts);
	console.log(lcm(counts));
}

processLineByLine();
