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

	// 0 north, 1 west, 2 south, 3 east
	const dirs = [[-1, 0], [0, -1], [1, 0], [0, 1]];

	function move(r, c, d) {
		let r1 = r;
		let c1 = c;

		do {
			r1 = r1 + d[0];
			c1 = c1 + d[1];

			if (r1 < 0 || r1 === map.length || c1 < 0 || c1 === map[0].length) {
				break;
			}
		} while (map[r1][c1] === ".");

		if (r1 !== r+d[0] || c1 !== c+d[1]) {
			map[r][c] = "."
			map[r1 - d[0]][c1 - d[1]] = "O";
		}
	}

	function tilt(dir) {
		const d = dirs[dir];

		if (dir < 2) {
			for (let r = 0; r < map.length; r++) {
				for (let c = 0; c < map[r].length; c++) {
					if (map[r][c] === "O") {
						move(r, c, d);
					}
				}
			}
		} else {
			for (let r = map.length - 1; r >= 0; r--) {
				for (let c = map[r].length - 1; c >= 0; c--) {
					if (map[r][c] === "O") {
						move(r, c, d);
					}
				}
			}
		}
	}

	function load() {
		let result = 0;
		map.forEach((row, r) => {
			// console.log(row.join(""));
			row.forEach(char => {
				if (char === "O") {
					result += (map.length - r);
				}
			});
		});

		// console.log("");

		return result;
	}

	function serialize() {
		return map.reduce((acc, row) => {
			return acc + row.join("");
		}, "");
	}


	const circle = 1000000000;

	const seen = new Set();
	const values = [];

	let key = serialize();;
	do {
		seen.add(key);

		dirs.forEach((d, index) => {
			tilt(index);
		});

		key = serialize();
		const l = load();
		values.push(l);

	} while (!seen.has(key));

	const repeat = values.length - 1;
	const start = values.indexOf(values[values.length -1]);
	const length = repeat - start;

	const target = (circle - 1 - start) % length + start;
	console.log(values[target]);
}

processLineByLine();
