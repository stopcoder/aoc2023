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

	const galaxies = [];

	const map = [];

	for await (const line of rl) {
		map.push(line.split(""));
		if (!line.includes("#")) {
			// expand row
			map.push(line.split(""));
		}
	}

	const emptyColumns = [];
	for (let c = 0; c < map[0].length; c++) {
		let noHash = true;
		for (let r = 0; r < map.length; r++) {
			if (map[r][c] === "#") {
				noHash = false;
			}
		}

		if (noHash) {
			emptyColumns.push(c);
		}
	}

	for (let i = emptyColumns.length - 1; i >= 0; i--) {
		map.forEach(row => {
			row.splice(emptyColumns[i], 0, ".");
		});
	}

	// map.forEach((row) => console.log(row.join("")));
	map.forEach((row, r) => {
		row.forEach((char, c) => {
			if (char === "#") {
				galaxies.push([r, c]);
			}
		});
	});

	let result = 0;
	for (let i = 0 ; i < galaxies.length - 1; i++) {
		for (let j = i + 1; j < galaxies.length; j++) {
			const g1 = galaxies[i];
			const g2 = galaxies[j];
			result += (Math.abs(g1[0] - g2[0]) + Math.abs(g1[1] - g2[1]));
		}
	}

	console.log(result);
}

processLineByLine();
