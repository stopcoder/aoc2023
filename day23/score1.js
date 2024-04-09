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

	const edges = {};

	function findDir(row, column) {
		return dirs.filter(dir => {
			const nr = row + dir[0];
			const nc = column + dir[1];

			if (nr >= 0 && nr < map.length && nc >= 0 && nc < map[nr].length && map[nr][nc] !== "#") {
				return true;
			}

			return false;
		});
	}


	/**
	 * This needs to be done with breath first search
	 *
	 * Since the direction symbols don't have any meaning, the generated graph is bidirectional.
	 *
	 *	edges[key][nkey] = step;
	 *	edges[nkey][key] = step;
	 */
	function findEdge(sr, sc) {
		const queue = [[sr, sc, [1, 0]]];
		const seen = new Set([genKey(sr, sc)]);

		while (queue.length) {
			const [r, c, d] = queue.shift();

			let lr = r;
			let lc = c;
			let nr = lr + d[0];
			let nc = lc + d[1];

			let nextDirs = findDir(nr, nc);
			let step = 1;

			while (nextDirs.length < 3) {
				nextDirs = nextDirs.filter(dir => {
					return (nr + dir[0] !== lr) || (nc + dir[1] !== lc);
				});

				if (nextDirs.length === 1) {
					lr = nr;
					lc = nc;
					nr = nr + nextDirs[0][0];
					nc = nc + nextDirs[0][1];
					nextDirs = findDir(nr, nc);
					step++;
				} else {
					break;
				}
			}

			const key = genKey(r, c);
			const nkey = genKey(nr, nc);
			edges[key] ??= {};
			edges[nkey] ??= {};

			edges[key][nkey] = step;
			edges[nkey][key] = step;

			if (seen.has(nkey)) {
				continue;
			}

			seen.add(nkey);

			nextDirs = nextDirs.filter(dir => {
				return (nr + dir[0] !== lr) || (nc + dir[1] !== lc);
			});

			nextDirs.forEach(dir => {
				queue.push([nr, nc, dir]);
			});
		}
	}

	const startKey = genKey(0, start);
	let seen = new Set([startKey]);

	findEdge(0, start);
	console.log(edges);

	const endKey = genKey(map.length - 1, end);
	seen = new Set([startKey]); 

	function dfs(key) {
		if (key === endKey) {
			return 0;
		}

		let max = -Number.MAX_SAFE_INTEGER;

		const nexts = edges[key];
		if (nexts) {
			Object.keys(nexts).forEach(nkey => {
				if (!seen.has(nkey)) {
					seen.add(nkey);
					max = Math.max(max, dfs(nkey) + nexts[nkey]);
					seen.delete(nkey);
				}
			});
		}

		return max;
	}

	const result = dfs(startKey);
	console.log(result);
}

processLineByLine();
