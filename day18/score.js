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

	// up right down left
	const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
	const dirmap = {
		"R": dirs[1],
		"U": dirs[0],
		"L": dirs[3],
		"D": dirs[2]
	};
	const points = [];

	for await (const line of rl) {
		const parts = line.split(" ");
		const dir = parts[0];
		const step = parseInt(parts[1]);
		const color = parts[2].substring(1, parts[2].length - 1);

		points.push({dir, step, color});
	}

	console.log(points);

	let r = 0;
	let c = 0;

	let minr = Number.MAX_SAFE_INTEGER;
	let minc = Number.MAX_SAFE_INTEGER;
	let maxr = -Number.MAX_SAFE_INTEGER;
	let maxc = -Number.MAX_SAFE_INTEGER;
	let coords = [];
	points.forEach(o => {
		const dr = dirmap[o.dir][0];
		const dc = dirmap[o.dir][1];

		for (let i = 0 ; i < o.step; i++) {
			r += dr;
			c += dc;

			coords.push([r, c]);
		}

		minr = Math.min(minr, r);
		minc = Math.min(minc, c);

		maxr = Math.max(maxr, r);
		maxc = Math.max(maxc, c);
	});

	console.log(minr, minc);

	const lr = maxr - minr + 1;
	const lc = maxc - minc + 1

	coords = coords.map(([r, c]) => {
		return [r - minr, c - minc];
	});

	function genKey(r, c) {
		return `${r},${c}`;
	}

	const pc = coords.reduce((acc, [r, c]) => {
		acc[genKey(r, c)] = true;
		return acc;
	}, {});

	console.log(pc);
	console.log(lr, lc);

	let count = 0;
	for (r = 0 ; r < lr; r++) {
		for (c = 0 ; c < lc; c++) {
			const key = genKey(r, c);

			if (pc.hasOwnProperty(key)) {
				count++;
			} else {
				let cross = 0;
				let tempU;
				let tempD;
				for (let c1 = c - 1; c1 >= 0; c1--) {
					const key1 = genKey(r, c1);
					if (pc.hasOwnProperty(key1)) {
						const up = (r - 1 >= 0 && pc.hasOwnProperty(genKey(r - 1, c1)));
						const down = (r + 1 < lr && pc.hasOwnProperty(genKey(r + 1, c1)));

						if (up && down) {
							cross++;
						} else if (up) {
							if (tempD) {
								cross++;
								tempD = undefined;
							} else if (tempU) {
								tempU = undefined;
							} else {
								tempU = true
							}
						} else if (down) {
							if (tempU) {
								cross++;
								tempU = undefined;
							} else if (tempD) {
								tempD = undefined;
							} else {
								tempD = true;
							}
						}
					}
				}

				if (cross % 2 === 1) {
					count++;
				}
			}
		}
	}

	console.log(count);
}

processLineByLine();
