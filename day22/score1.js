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

	const bricks = [];

	for await (const line of rl) {
		const [start, end] = line.split("~").map(s => s.split(",").map((s => parseInt(s))));
		bricks.push([...start, ...end]);
	}

	function compareBricks(b1, b2) {
		if (b1[2] !== b2[2]) {
			return b1[2] - b2[2];
		} else {
			return b1[5] - b2[5];
		}
	}

	bricks.sort(compareBricks);

	function intersect(range1, range2) {
		const maxStart = Math.max(range1[0], range2[0]);
		const minEnd = Math.min(range1[1], range2[1]);
		return maxStart <= minEnd;
	}

	function brickIntersect(brick1, brick2) {
		return intersect([brick1[0], brick1[3]], [brick2[0], brick2[3]])
			&& intersect([brick1[1], brick1[4]], [brick2[1], brick2[4]]);
	}

	function genKey(brick) {
		return `${brick.join(",")}`;
	}

	for (let i = 0; i < bricks.length ; i++) {
		const brick = bricks[i];
		let minZ = 1;
		for (let j = 0; j < i; j++) {
			const lower_brick = bricks[j];
			if (brickIntersect(brick, lower_brick)) {
				minZ = Math.max(minZ, lower_brick[5] + 1);
			}
		}

		brick[5] = minZ + brick[5] - brick[2];
		brick[2] = minZ;

		console.log(`${genKey(brick)} is set`);
	}

	bricks.sort(compareBricks);

	const singleSupport = new Set();

	const supports = {};
	const supported = {};

	for (let i = 0; i < bricks.length ; i++) {
		const brick = bricks[i];
		const support = [];
		for (let j = 0; j < i; j++) {
			const below = bricks[j];
			if (below[5] === brick[2] - 1 && brickIntersect(brick, below)) {
				supported[i] ??= [];
				supported[i].push(j);

				supports[j] ??= [];
				supports[j].push(i);
			}
		}

		if (supported[i] && supported[i].length === 1) {
			singleSupport.add(supported[i][0]);
		}
	}

	function destruct(supports, supported, removeIndex) {
		let count = 0;
		const queue = [removeIndex];

		while (queue.length) {
			const removed = queue.shift();
			count++;

			const changed = supports[removed];

			if (changed) {
				changed.forEach((index) => {
					const below = supported[index];
					below.splice(below.indexOf(removed), 1);

					if (below.length === 0) {
						queue.push(index);
					}
				});
			}
		}

		return count - 1;
	}

	let result = 0;
	for (const index of singleSupport) {
		const supportedCopy = Object.keys(supported).reduce((acc, key) => {
			acc[key] = supported[key].slice();
			return acc;
		}, {});

		result += destruct(supports, supportedCopy, index);
	}

	console.log(result);

}

processLineByLine();
