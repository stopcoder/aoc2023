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
	const time = 38947970;
	const distance = 241154910741091;

	let i;
	for (i = 1; i < time; i++) {
		const total = i * (time - i);
		if (total > distance) {
			break;
		}
	}
	const start = i;

	for (i = time; i > 0; i--) {
		const total = i * (time - i);
		if (total > distance) {
			break;
		}
	}

	console.log(i - start + 1);
}

processLineByLine();
