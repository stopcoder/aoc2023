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

	let result = 0;
	let points = [];
	for await (const line of rl) {
		const parts = line.split(" | ");
		const winNums = parts[0].split(": ")[1].split(" ").filter((s) => !!s);
		const myNums = parts[1].split(" ").filter((s) => !!s);

		const map = winNums.reduce((acc, s) => {
			acc[s] = true;
			return acc;
		}, {});

		const count = myNums.reduce((acc, s) => {
			if (map[s]) {
				acc++;
			}
			return acc;
		}, 0);

		points.push(count);
	}

	const cards = Array(points.length).fill(1);

	points.forEach((p, index) => {
		for (let i = 0; i < p; i++) {
			const newIndex = index + i + 1;
			if (newIndex < cards.length) {
				cards[newIndex] += cards[index];
			}
		}
	});

	result = cards.reduce((acc, c) => acc + c, 0);
	console.log(result);
}

processLineByLine();
