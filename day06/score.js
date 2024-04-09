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
	const time = [38,94,79,70];
	const distance = [241,1549,1074,1091];

	const result = time.reduce((acc, t, index) => {
		let count = 0;
		for (let i = 1; i < t; i++) {
			const total = i * (t - i);
			if (total > distance[index]) {
				count++;
			}
		}
		acc *= count;
		return acc;
	}, 1);

	console.log(result);
}

processLineByLine();
