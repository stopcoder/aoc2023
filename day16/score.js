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

	const map = [];

	for await (const line of rl) {
		map.push(line.split(""));
	}

	// up, right, down, left
	// 0 ,   1 ,   2,     3
	const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];

	const go = {
		".": [0, 1, 2, 3],
		"|": [0, [0, 2], 2, [0, 2]],
		"-": [[1,3], 1, [1,3], 3],
		"/": [1, 0, 3, 2],
		"\\": [3, 2, 1, 0]
	};

	function key(r, c, d) {
		return `${r},${c},${d}`;
	}

	const seen = new Set();
	const points = new Set();

	let sr = 0;
	let sc = -1;
	let dir = 1;

	const queue = [[sr, sc, dir]];

	while (queue.length) {
		const [row, column, direction] = queue.shift();

		const k = key(row, column, direction);

		if (seen.has(k)) {
			continue;
		}

		seen.add(k);
		console.log(k);
		points.add(`${row},${column}`);

		let nextR = row + dirs[direction][0];
		let nextC = column + dirs[direction][1];

		if (nextR >=0 && nextR < map.length && nextC >= 0 && nextC < map[nextR].length) {
			let nextD = go[map[nextR][nextC]][direction];
			if (!Array.isArray(nextD)) {
				nextD = [nextD];
			}

			nextD.forEach(d => {
				queue.push([nextR, nextC, d]);
			});
		}
	}

	console.log(points.size - 1);
}

processLineByLine();
