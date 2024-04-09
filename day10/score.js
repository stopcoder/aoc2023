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

	const map = [];
	for await (const line of rl) {
		map.push(line.split(""));
	}

	/*
	 * | is a vertical pipe connecting north and south.
	 * - is a horizontal pipe connecting east and west.
	 * L is a 90-degree bend connecting north and east.
	 * J is a 90-degree bend connecting north and west.
	 * 7 is a 90-degree bend connecting south and west.
	 * F is a 90-degree bend connecting south and east.
	 * . is ground; there is no pipe in this tile.
	 * S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
	 */

	// up, right, down, left
	const delta = [[-1, 0], [0, 1], [1, 0], [0, -1]];
	const up = ["7", "|", "F"];
	const down = ["|", "J", "L"];
	const left = ["-", "L", "F"];
	const right = ["7", "-", "J"];
	let connectivity = {
		"|": [up, [], down, []],
		"-": [[], right, [], left],
		"L": [up, right, [], []],
		"J": [up, [], [], left],
		"7": [[], [], down, left],
		"F": [[], right, down, []],
		"S": [up, right, down, left]
	};

	let sr, sc;
	for (let i = 0; i < map.length; i++) {
		const row = map[i];
		for (let j = 0; j < row.length; j++) {
			const char = row[j];

			if (char === "S") {
				sr = i;
				sc = j;
			}
		}
	}

	const visited = new Set();
	console.log(`start: ${sr},${sc}`);
	const queue = [[sr, sc, 0]];
	let lastVisited;

	while (queue.length) {
		const current = queue.shift();
		const key = `${current[0]},${current[1]}`;
		const char = map[current[0]][current[1]];
		if (visited.has(key)) {
			continue;
		}

		visited.add(key);
		lastVisited = current;
		delta.forEach((d, index) => {
			const x = current[0] + d[0];
			const y = current[1] + d[1];

			if (x >= 0 && x < map.length && y >=0 && y <= map[x].length) {
				const connect = connectivity[char][index];
				if (connect && connect.includes(map[x][y])) {
					queue.push([x, y, current[2] + 1]);
				}
			}
		});
	}

	console.log(lastVisited[2]);
}

processLineByLine();
