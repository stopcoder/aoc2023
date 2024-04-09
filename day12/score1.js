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

	const cache = {};
	function count(chars, counts) {
		if (chars.length === 0) {
			return counts.length === 0 ? 1 : 0;
		}

		if (counts.length === 0) {
			return chars.includes("#") ? 0 : 1;
		}

		const key = `${chars.join("")}|${counts.join(",")}`;

		if (cache.hasOwnProperty(key)) {
			return cache[key];
		}

		const firstChar = chars[0];
		let result = 0;
		if (firstChar === "." || firstChar === "?") {
			result += count(chars.slice(1), counts);
		}

		if (firstChar === "#" || firstChar === "?") {
			if (chars.length >= counts[0] && !chars.slice(0, counts[0]).includes(".") && (chars.length === counts[0] || chars[counts[0]] !== "#")) {
				result += count(chars.slice(counts[0] + 1), counts.slice(1));
			}
		}

		cache[key] = result;
		return result;
	}

	let result = 0;
	for await (const line of rl) {
		const parts = line.split(" ");

		const chars = Array(5).fill(parts[0]).join("?").split("");
		const counts = Array(5).fill(parts[1]).join(",").split(",").map(c => parseInt(c));

		result += count(chars, counts);
	}

	console.log(result);
}

processLineByLine();
