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
		bricks.push({start, end});
	}

	bricks.sort((b1, b2) => {
		if (b1.start[2] !== b2.start[2]) {
			return b1.start[2] - b2.start[2];
		} else {
			return b1.end[2] - b2.end[2];
		}
	});

	const layers = [];

	function brickIntersect(brick1, brick2) {
		return intersect([brick1.start[0], brick1.end[0]], [brick2.start[0], brick2.end[0]])
			&& intersect([brick1.start[1], brick1.end[1]], [brick2.start[1], brick2.end[1]]);
	}

	function intersect(range1, range2) {
		const maxStart = Math.max(range1[0], range2[0]);
		const minEnd = Math.min(range1[1], range2[1]);
		return maxStart <= minEnd;
	}

	function fit(brick) {
		if (layers.length === 0) {
			return 1;
		}

		let layerIndex = layers.length;

		while (layerIndex > 1) {
			let found;
			for (let i = layerIndex - 1; i >= layerIndex - 1 - brick.end[2] + brick.start[2]; i--) {
				if (i < 1) {
					return 1;
				}

				const bricks = layers[i];

				found = bricks.every(existingBrick => !brickIntersect(brick, existingBrick));

				if (!found) {
					break;
				}
			}

			if (!found) {
				break;
			} else {
				layerIndex--;
			}
		}

		return layerIndex;
	}

	function genKey(brick) {
		return `${brick.start.join(",")}-${brick.end.join(",")}`;
	}

	for (let i = 0; i < bricks.length ; i++) {
		const brick = bricks[i];
		const layerIndex = fit(brick);

		for (let j = layerIndex; j <= layerIndex + brick.end[2] - brick.start[2]; j++) {
			layers[j] ??= [];
			layers[j].push(brick);
		}

		console.log(`${genKey(brick)} set to layer ${layerIndex}`);
	}

	console.log(layers);

	let supportive = new Set();

	for (let i = 2; i < layers.length; i++) {
		for (let l1 = 0; l1 < layers[i].length; l1++) {
			let below = [];
			let key1 = genKey(layers[i][l1]);
			for (let l2 = 0; l2 < layers[i-1].length; l2++) {
				let key2 = genKey(layers[i-1][l2]);
				if (key1 !== key2 && brickIntersect(layers[i][l1], layers[i-1][l2])) {
					below.push(layers[i-1][l2]);
				}
			}

			if (below.length === 1) {
				supportive.add(genKey(below[0]));
			}
		}

	}

	console.log(bricks.length - supportive.size);
}

processLineByLine();
