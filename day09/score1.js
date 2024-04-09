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

	function nextNumber(numbers) {
		let history = [];
		let current = numbers;
		while(!current.every((num => num === 0))) {
			history.push(current[0]);
			numbers = [];
			for (let i = 0; i < current.length - 1; i++) {
				numbers.push(current[i+1] - current[i]);
			}
			current = numbers;
		}

		return history.reverse().reduce((acc, num) => num - acc, 0);
	}

	let result = 0;
	for await (const line of rl) {
		let num = nextNumber(line.split(" ").map(s => parseInt(s)));
		console.log(line);
		console.log(num);
		result += num;
	}

	console.log(result);
}

processLineByLine();
