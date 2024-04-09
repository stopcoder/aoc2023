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

	// right down left up
	const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
	const dirmap = {
		"R": dirs[0],
		"U": dirs[3],
		"L": dirs[2],
		"D": dirs[1]
	};
	const points = [];
	let pathCount = 0;

	for await (const line of rl) {
		const parts = line.split(" ");
		const step = parseInt(parts[2].substring(2, parts[2].length - 2), 16);;
		const dir =  parseInt(parts[2].charAt(parts[2].length - 2));

		points.push({dir, step});
		pathCount += step;
	}

	console.log(points);

	let r = 0;
	let c = 0;

	let minr = Number.MAX_SAFE_INTEGER;
	let minc = Number.MAX_SAFE_INTEGER;
	let maxr = -Number.MAX_SAFE_INTEGER;
	let maxc = -Number.MAX_SAFE_INTEGER;
	let coords = [];
	points.forEach((o, i) => {
		if (i > 0) {
			if (o.dir === 3) { // up
				coords[i - 1][2] = false;
			}
			if (o.dir === 1) {
				coords[i - 1][2] = true;
			}
			if ((o.dir === 0 || o.dir === 2) && i > 1) {
				coords[i - 1][2] = !coords[i - 2][2];
			}
		}
		const dr = dirs[o.dir][0];
		const dc = dirs[o.dir][1];

		r += (o.step * dr);
		c += (o.step * dc);

		coords.push([r, c]);

		if (i === points.length - 1) {
			console.log(o);
			coords[i][2] = (o.dir === 3);
		}

		minr = Math.min(minr, r);
		minc = Math.min(minc, c);

		maxr = Math.max(maxr, r);
		maxc = Math.max(maxc, c);
	});

	coords = coords.map(([r, c, down]) => {
		return [r - minr, c - minc, down];
	});

	console.log(coords);

	const area = Math.abs(coords.reduce((acc, coord, i) => {
		const prev = i > 0 ? i - 1 : coords.length - 1;
		const next = (i + 1) % coords.length;

		return acc + coords[i][0] * (coords[prev][1] - coords[next][1]);
	}, 0)) / 2;

	const interior = area - pathCount / 2 + 1;
	console.log(interior + pathCount);
}

processLineByLine();
