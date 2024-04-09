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
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const available = {
		red: 12,
		green: 13,
		blue: 14
	};

	function possible(game) {
		return Object.keys(game).every((key) => game[key] <= available[key]);
	}

	let result = 0;

	for await (const line of rl) {
		const s1 = line.split(": ");
		const gameNumber = parseInt(s1[0].split(" ")[1]);
		const games = s1[1].split("; ").map((game) => {
			const parts = game.split(", ");

			return parts.reduce((acc, part) => {
				const split = part.split(" ");
				acc[split[1]] = parseInt(split[0]);
				return acc;
			}, {});
		});

		if (games.every(possible)) {
			result += gameNumber;
		}
	}

	console.log(result);
}

processLineByLine();
