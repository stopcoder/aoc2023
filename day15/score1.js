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

	function hash(s) {
		return s.split("").reduce((acc, char) => ((acc + char.charCodeAt(0)) * 17) % 256, 0);
	}

	function remove(box, name) {
		let index;
		box.some((lens, i) => {
			if (lens[0] === name) {
				index = i;
				return true;
			}
		});

		if (index !== undefined) {
			box.splice(index, 1);
		}
	}

	function insert(box, name, focal) {
		const contains = box.some((lens, i) => {
			if (lens[0] === name) {
				lens[1] = focal;
				return true;
			}
		});

		if (!contains) {
			box.push([name, focal]);
		}
	}

	let parts;
	for await (const line of rl) {
		parts = line.split(",");
	}

	let boxes = [];

	parts.forEach(s => {
		let name;
		let rem;
		let focal;
		if (s.endsWith("-")) {
			name = s.substring(0, s.length - 1);
			rem = true;
		} else {
			name = s.substring(0, s.length - 2);
			rem = false;
			focal = parseInt(s.charAt(s.length -1));
		}

		const index = hash(name);
		boxes[index] ??= [];

		if (rem) {
			remove(boxes[index], name);
		} else {
			insert(boxes[index], name, focal);
		}
	});

	const result = boxes.reduce((acc, box, index) => {
		return acc + box.reduce((acc, lens, lIndex) => {
			return acc + (index + 1) * (lIndex + 1) * lens[1];
		}, 0);
	}, 0);

	console.log(result);
}

processLineByLine();
