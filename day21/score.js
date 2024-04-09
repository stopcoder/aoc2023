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
	let row = 0;
	let sr;
	let sc;

	for await (const line of rl) {
		const parts = line.split("");
		map.push(parts);

		const sIndex = parts.indexOf("S");
		if (sIndex !== -1) {
			sr = row;
			sc = sIndex;
			map[sr][sc] = ".";
		}

		row++;
	}

	function genKey(r, c) {
		return `${r},${c}`;
	};


	const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
	let repeat = 64;
	const seen = new Set([genKey(sr, sc)]);
	const ans = [];
	const queue = [[sr, sc, repeat]];
	
	while (queue.length) {
		const [row, column, steps] = queue.shift();

		if (steps % 2 === 0) {
			ans.push([row, column]);
		}

		if (steps === 0) {
			continue;
		}

		dirs.forEach(([dr, dc]) => {
			const nr = row + dr;
			const nc = column + dc;
			if (nr >= 0 && nr < map.length && nc >= 0 && nc <= map[0].length) {
				const key = genKey(nr, nc);
				if (!seen.has(key) && map[nr][nc] === ".") {
					seen.add(key);
					queue.push([nr, nc, steps - 1]);
				}
			}
		});
	}

	console.log(ans.length);
}

processLineByLine();
