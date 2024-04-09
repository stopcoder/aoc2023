import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import permutation from "./permutation.js";

const { OrderedMap, PriorityQueue, LinkList, Deque } = jsSdsl;
const filename = "input1";

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
	// up, right, down, left
	const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];

	for await (const line of rl) {
		map.push(line.split(""));
	}

	const start = map[0].indexOf(".");
	const end = map[map.length - 1].indexOf(".");

	function genKey(row, column) {
		return `${row},${column}`;
	}

	function genCacheKey(row, column, visited) {
		return `${row},${column}}`;
	}

	// up 0, right 1, down 2, left 3, try all -1
	function downhill(row, column) {
		if (row === map.length - 1 && column === end) {
			console.log(`${[...seen].join(" ")}: ${seen.size}`);
			return 0;
		}

		let max = 0;
		let char = map[row][column];

		for (let i = 0 ; i < dirs.length; i++) {
			const nr = row + dirs[i][0];
			const nc = column + dirs[i][1];
			const nkey = genKey(nr, nc);

			if (nr < 0 || nr >= map.length || nc < 0 || nc >= map[nr].length) {
				continue;
			}

			if (map[nr][nc] === "#") {
				continue;
			}

			if (char === ">" && i !== 1) {
				continue;
			}

			if (char === "<" && i !== 3) {
				continue;
			}

			if (char === "v" && i !== 2) {
				continue;
			}

			if (char === "^" && i !== 0) {
				continue;
			}

			if (seen.has(nkey)) {
				continue;
			}

			seen.add(nkey);

			max = Math.max(max, downhill(nr, nc) + 1);

			seen.delete(nkey);
		}

		return max;
	}

	const startKey = genKey(0, start);
	const seen = new Set([startKey]);

	const result = downhill(0, start);
	console.log(result);
}

processLineByLine();
