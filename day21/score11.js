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

	console.log(`map row: ${map.length}, map column: ${map[0].length}`);
	console.log(`start: (${sr}, ${sc})`);

	function travel(sr, sc, steps) {
		const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
		
		const seen = new Set([genKey(sr, sc)]);
		const ans = [];
		const queue = [[sr, sc, steps]];

		while (queue.length) {
			const [row, column, rest] = queue.shift();

			if (rest % 2 === 0) {
				ans.push([row, column]);
			}

			if (rest === 0) {
				continue;
			}

			dirs.forEach(([dr, dc]) => {
				const nr = row + dr;
				const nc = column + dc;
				const key = genKey(nr, nc);
				if (!seen.has(key) && map[((nr % map.length) + map.length) % map.length][((nc % map.length) + map.length) % map.length] === ".") {
					seen.add(key);
					queue.push([nr, nc, rest - 1]);
				}
			});
		}

		return ans.length;
	}

	const steps = 26501365;
	const stepLength = 2 * map.length;
	const rest = steps % map.length;


	/*
	// delta's delta is a constant

	let preCount = 0;
	let preDelta = 0;

	for (let i = 0; i <= 100; i++) {
		const count = travel(sr, sc, rest + stepLength * i);
		const delta = count - preCount;
		console.log(`round ${i}, count ${count}, delta ${delta}, delta1 ${delta - preDelta}`);
		preDelta = delta;
		preCount = count;
	}
	*/


	let count = 95442;
	let delta = 213328;
	const d2 = 121768;

	let step = rest + stepLength;

	while (step < steps) {
		step += stepLength;
		count += delta;
		delta += d2;
	}

	console.log(count);
}

processLineByLine();
