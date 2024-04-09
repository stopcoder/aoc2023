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
				if (nr >= 0 && nr < map.length && nc >= 0 && nc <= map[0].length) {
					const key = genKey(nr, nc);
					if (!seen.has(key) && map[nr][nc] === ".") {
						seen.add(key);
						queue.push([nr, nc, rest - 1]);
					}
				}
			});
		}

		return ans.length;
	}


	console.log(`from center even: ${travel(sr, sc, 200)}`);
	console.log(`from center odd: ${travel(sr, sc, 201)}`);

	console.log(`from corner even: ${travel(130, 0, 300)}`);
	console.log(`from corner odd: ${travel(130, 0, 301)}`);

	const singleOddResult = travel(sr, sc, 301);
	const singleEvenResult = travel(sr, sc, 300);

	const steps = 26501365;
	const expansion = Math.floor(steps / map.length);

	const evenCount = 4 * (Math.ceil((expansion - 1) / 2) * expansion) / 2;
	const oddCount = 4 * (Math.floor((expansion - 1) / 2) * expansion) / 2 + 1;

	console.log(oddCount, evenCount);

	const cornerResult = travel(65, 0, map.length - 1) + travel(130, 65, map.length - 1) + travel(65, 130, map.length - 1) + travel(0, 65, map.length - 1);
	const edgeResult = (expansion - 1) * (travel(130, 0, Math.floor(map.length * 3 / 2) - 1) + travel(0, 130, Math.floor(map.length * 3 / 2) - 1) + travel(0, 0, Math.floor(map.length * 3 / 2) - 1) + travel(130, 130, Math.floor(map.length * 3 / 2) - 1));

	const smallCornerResult = expansion * (travel(130, 0, Math.floor(map.length / 2) - 1) + travel(0, 130, Math.floor(map.length / 2) - 1) + travel(0, 0, Math.floor(map.length / 2) - 1) + travel(130, 130, Math.floor(map.length / 2) - 1));

	const oddResult = oddCount * singleOddResult;
	const evenResult = evenCount * singleEvenResult;

	const result = oddResult + evenResult + cornerResult + edgeResult + smallCornerResult;

	console.log(result);
}

processLineByLine();
