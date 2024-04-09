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

	function valid(chars, counts) {
		let cIndex = 0;
		let count;
		for (let i = 0; i < chars.length; i++) {
			const c = chars[i];
			if (c === "#") {
				if (cIndex === counts.length) {
					return false;
				}
				count ??= 0;
				count++;
			} else {
				if (count) {
					// compare
					if (count !== counts[cIndex]) {
						return false;
					}

					count = undefined;
					cIndex++;
				}
			}
		}

		if (count) {
			if (count !== counts[cIndex]) {
				return false;
			}
			count = undefined;
			cIndex++;
		}

		if (cIndex === counts.length) {
			return true;
		} else {
			return false;
		}
	}

	function replace(chars, mask) {
		let pointer = 0;
		let copy = chars.slice();
		for (let i = copy.length - 1; i >= 0; i--) {
			if (copy[i] === "?") {
				const m = 1 << pointer;
				const broken = mask & m;
				copy[i] = broken ? "#" : ".";
				pointer++;
			}
		}
		return copy;
	}

	let result = 0;
	for await (const line of rl) {
		const parts = line.split(" ");

		const chars = parts[0].split("");
		const counts = parts[1].split(",").map(c => parseInt(c));

		const numberOfQs = chars.reduce((acc, c) => {
			if (c === "?") {
				return acc + 1;
			} else {
				return acc;
			}
		}, 0);

		// console.log(`original: ${chars}`);

		let limit = Math.pow(2, numberOfQs);
		for (let mask = 0; mask < limit; mask++) {
			const replaced = replace(chars, mask);
			// console.log(`replaced: ${replaced}`);

			if (valid(replaced, counts)) {
				result++;
			}
		}
	}

	console.log(result);
}

processLineByLine();
