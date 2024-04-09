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

	const low = "0".charCodeAt(0);
	const high = "9".charCodeAt(0);

	function getNumber(line) {
		const chars = line.split("");
		let result = 0;

		for (let i = 0; i < chars.length; i++) {
			const code = chars[i].charCodeAt(0);

			if (code >= low && code <= high) {
				result += 10 * (code - low);
				break;
			}
		}
		for (let i = chars.length - 1; i >= 0; i--) {
			const code = chars[i].charCodeAt(0);

			if (code >= low && code <= high) {
				result += (code - low);
				break;
			}
		}

		console.log(`${line} => ${result}`);

		return result;
	};

	let final = 0;
	for await (const line of rl) {
		final += getNumber(line);
	}

	console.log(final);
}

processLineByLine();
