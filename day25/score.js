import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import permutation from "./permutation.js";
import findMinimumCut from './minCut.js';

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

	const edges = [];
	const vertices = [];

	for await (const line of rl) {
		let [v1, vs] = line.split(": ");
		vs = vs.split(" ");

		let iv = vertices.indexOf(v1);
		if (iv === -1) {
			iv = vertices.length;
			vertices.push(v1);
		}

		vs.forEach((v) => {
			let i = vertices.indexOf(v);
			if (i === -1) {
				i = vertices.length;
				vertices.push(v);
			}
			if (iv < i) {
				edges.push([v1, v]);
			} else {
				edges.push([v, v1]);
			}
		});
	}

	console.log(edges.length);
	console.log(vertices.length);

	let result;
	do {
		const vs = vertices.slice();
		const edgesCopy = edges.map(e => e.slice());
		result = findMinimumCut(vs, edgesCopy);
	} while (result[0].length !== 3)

	console.log(result[0]);

	function reconstruct(vertex, record) {
		let res = [vertex];
		let queue = [vertex];
		while (queue.length) {
			const v = queue.shift();
			if (record.has(v)) {
				res = [...res, ...record.get(v)];
				queue = [...queue, ...record.get(v)];
			}
		}
		return res;
	}

	console.log(reconstruct(result[0][0][0], result[1]).length * reconstruct(result[0][0][1], result[1]).length);
}

processLineByLine();
