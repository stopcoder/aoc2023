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

	const maps = [];

	let map = [];
	for await (const line of rl) {
		if (!line) {
			maps.push(map);
			map = [];
		} else {
			map.push(line.split(""));
		}
	}

	maps.push(map);
	// console.log(maps);

	function compare(a1, a2) {
		return a1.every((c, i) => c === a2[i]);
	}

	let result = 0;

	maps.forEach((map) => {
		let row;
		let mirrored;
		for (row = 0 ; row < map.length - 1; row++) {
			let r1 = row;
			let r2 = row + 1;


			while (r1 >= 0 && r1 < map.length && r2 < map.length) {
				mirrored = compare(map[r1], map[r2]);

				if (!mirrored) {
					break;
				}

				r1--;
				r2++;
			}

			if (mirrored) {
				result += ((row + 1) * 100);
			}
		}

		if (!mirrored) {
			let column;
			for (column = 0 ; column < map[0].length - 1; column++) {
				let c1 = column;
				let c2 = column + 1;


				while (c1 >= 0 && c1 < map[0].length && c2 < map[0].length) {
					mirrored = compare(map.map((row) => row[c1]), map.map((row) => row[c2]));

					if (!mirrored) {
						break;
					}

					c1--;
					c2++;
				}

				if (mirrored) {
					result += (column + 1);
				}
			}
		}
	});

	console.log(result);

}

processLineByLine();
