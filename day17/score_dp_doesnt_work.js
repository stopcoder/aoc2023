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

	for await (const line of rl) {
		map.push(line.split("").map(s => parseInt(s)));
	}

	// up right down left
	const dirs = [[-1,0], [0,1], [1,0], [0,-1]];

	function key(r, c) {
		return `(${r},${c})`;
	}

	function cacheKey(r, c, dir, repeat) {
		return `(${r},${c},${dir},${repeat})`;
	}

	const cache = {};

	// this can't work because the search space is too big without memorization.
	// with memorization, the cached value is the optimal value under the given visited nodes. It may not be
	// the optimal value once the visited nodes are different than the ones when the optimal value is stored.
	function calc(r, c, dir, repeat, visited) {
		// console.log(`(${r},${c}) direction: ${dir}, repeat: ${repeat}, path: ${path}`);
		if (r === map.length - 1 && c === map[r].length - 1) {
			return {
				value: map[r][c],
				path: [[r,c]]
			};
		}

		const cachek = cacheKey(r, c, dir, repeat, visited);

		if (cache.hasOwnProperty(cachek)) {
			return cache[cachek];
		}

		let optValue = Number.MAX_SAFE_INTEGER;
		let optPath;
		let res;
		for (let index = 0; index < dirs.length; index++) {
			const nr = r + dirs[index][0];
			const nc = c + dirs[index][1];
			const nk = key(nr, nc);

			if (nr >= 0 && nr < map.length && nc >= 0 && nc < map[nr].length && !visited.includes(nk)) {
				const newVisited = visited.slice();
				newVisited.push(nk);
				if (index === dir) {
					if (repeat < 3) {
						res = calc(nr, nc, index, repeat + 1, newVisited);
						if (res.value < optValue) {
							optValue = res.value;
							optPath = res.path;
						}
					}
				} else {
					res = calc(nr, nc, index, 1, newVisited);
					if (res.value < optValue) {
						optValue = res.value;
						optPath = res.path;
					}
				}
			}
		}

		if (optPath) {
			optValue = map[r][c] + optValue;
			optPath = optPath.slice();
			optPath.unshift([r,c]);
		}

		let result = {
			value: optValue,
			path: optPath
		};

		cache[cachek] = result;

		return result;
	}

	const toRight = calc(0, 1, 1, 1, ["(0,1)"]);
	const toDown = calc(1, 0, 2, 1, ["(1,0)"]);

	console.log(toRight);
	console.log(toDown);

	console.log(Math.min(toRight.value, toDown.value));
}

processLineByLine();
