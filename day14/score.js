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

	for (let r = 1; r < map.length; r++) {
		const row = map[r];
		for (let c = 0; c < row.length; c++) {
			const char = row[c];
			if (char === "O") {
				let roll = r - 1;
				while (map[roll][c] === ".") {
					roll--;
					if (roll == -1) {
						break;
					}
				}

				if (roll !== r - 1) {
					row[c] = ".";
					map[roll + 1][c] = "O";
				}
				/*
				for (let roll = r - 1; roll >= 0; roll--) {
					if (map[roll][c] !== ".") {
						row[c] = ".";
						map[roll + 1][c] = "O";
						break;
					}
					if (roll == 0) {
						row[c] = ".";
						map[0][c] = "O";
					}
				}
				*/
			}
		}
	}

	let result = 0;
	map.forEach((row, r) => {
		console.log(row.join(""));
		row.forEach(char => {
			if (char === "O") {
				result += (map.length - r);
			}
		});
	});


	console.log(result);
}

processLineByLine();
