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

	const rays = [];

	for await (const line of rl) {
		let [p, v] = line.split(" @ ");
		p = p.split(", ").filter(c => c).map(c => parseInt(c));
		v = v.split(", ").filter(c => c).map(c => parseInt(c));
		rays.push([p, v]);
	}

	console.log(rays);

	function intersect(i, j) {
		const a1 = rays[i][1][1] / rays[i][1][0];
		const a2 = rays[j][1][1] / rays[j][1][0];

		if (a1 === a2) {
			return false;
		}

		const x = ((rays[j][0][1] - rays[i][0][1]) - (a2 * rays[j][0][0] - a1 * rays[i][0][0])) / (a1 - a2);
		const y = a1 * x + rays[i][0][1] - (a1 * rays[i][0][0]);

		return [x, y];
	}

	const low = 200000000000000;
	const high = 400000000000000;

	let count = 0;
	for (let i = 0; i < rays.length; i++) {
		for (let j = i + 1; j < rays.length; j++) {
			const point = intersect(i, j);
			if (point[0] >= low && point[0] <= high && point[1] >= low && point[1] <= high
				&& (point[0] * (rays[i][1][0]/Math.abs(rays[i][1][0])) >= rays[i][0][0] * (rays[i][1][0]/Math.abs(rays[i][1][0])))
				&& (point[1] * (rays[i][1][1]/Math.abs(rays[i][1][1])) >= rays[i][0][1] * (rays[i][1][1]/Math.abs(rays[i][1][1])))
				&& (point[0] * (rays[j][1][0]/Math.abs(rays[j][1][0])) >= rays[j][0][0] * (rays[j][1][0]/Math.abs(rays[j][1][0])))
				&& (point[1] * (rays[j][1][1]/Math.abs(rays[j][1][1])) >= rays[j][0][1] * (rays[j][1][1]/Math.abs(rays[j][1][1])))) {
				console.log("intersect:")
				console.log(rays[i]);
				console.log(rays[j]);
				console.log(point);
				console.log("");
				count++;
			}
		}
	}

	console.log(count);
}

processLineByLine();
