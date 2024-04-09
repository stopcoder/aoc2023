import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import dijkstra from 'dijkstrajs';


const { find_path, single_source_shortest_paths } = dijkstra;
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
	const map = [];

	const delta = [[1,0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];

	const memo = {};
	function isStar(r, c) {
		if (r < 0 || r >= map.length || c < 0 || c >= map[r].length) {
			return false;
		}

		const char = map[r][c];
		return char === "*";
	}

	function checkNumber(r, c, length) {
		for (let i = c; i < c + length; i++) {
			const result = delta.some((d) => {
				if (isStar(r + d[0], i + d[1])) {
					const key = `${r + d[0]},${i + d[1]}`;
					memo[key] = memo[key] || [];
					memo[key].push(parseInt(map[r].slice(c, c + length).join("")));
					return true;
				}
			});
			if (result) {
				break;
			}
		}
	}

	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		map.push(line.split(""));
	}

	map.forEach((row, r) => {
		let start;
		let length;
		for (let c = 0 ; c < row.length ; c++) {
			const char = row[c];

			if (char >= '0' && char <= '9') {
				if (start) {
					length++;
				} else {
					start = [r, c];
					length = 1;
				}
			} else {
				if (start) {
					checkNumber(start[0], start[1], length);
				}
				start = null;
			}
		}

		if (start) {
			checkNumber(start[0], start[1], length);
		}
	});

	const result = Object.keys(memo).reduce((acc, star) => {
		const numbers = memo[star];
		if (numbers.length === 2) {
			acc += (numbers[0] * numbers[1]);
		}
		return acc;
	}, 0);

	console.log(result);
}

processLineByLine();
