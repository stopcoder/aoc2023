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
		map.push(line.split("").map(s => parseInt(s)));
	}

	// up right down left
	const dirs = [[-1,0], [0,1], [1,0], [0,-1]];

	function genKey(r, c, dir, repeat) {
		return `(${r},${c},${dir},${repeat})`;
	}

	const heap = new PriorityQueue(
		// initialize the incoming arr, the complexity of doing so is O(n)
		[
			[1,0,2,1,map[1][0],[]],
			[0,1,1,1,map[0][1],[]],
		],
		// this will create a small root heap, the default is a large root heap
		(x, y) => x[4] - y[4]
	);

	const visited = new Set();

	while (heap.length) {
		const [r, c, dir, repeat, value, path] = heap.pop();

		const key = genKey(r, c, dir, repeat);
		if (visited.has(key)) {
			continue;
		}

		visited.add(key);

		if (r === map.length - 1 && c === map[0].length - 1 && repeat >= 4) {
			console.log(value);
			console.log(path);
			break;
		}

		const newPath = path.slice();
		newPath.push([r,c]);

		for (let i = 0; i < dirs.length; i++) {
			if ((i + 2) % 4 === dir) {
				continue;
			}

			const nr = r + dirs[i][0];
			const nc = c + dirs[i][1];

			if (nr >= 0 && nr < map.length && nc >= 0 && nc < map[0].length) {
				if (i === dir) {
					if (repeat < 10) {
						heap.push([nr, nc, i, repeat + 1, value + map[nr][nc], newPath]);
					}
				} else {
					if (repeat >= 4)
					heap.push([nr, nc, i, 1, value + map[nr][nc], newPath]);
				}
			}
		}
	}
}

processLineByLine();
