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

	// right down left up
	const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
	const dirmap = {
		"R": dirs[0],
		"U": dirs[3],
		"L": dirs[2],
		"D": dirs[1]
	};
	const points = [];
	let pathCount = 0;

	for await (const line of rl) {
		const parts = line.split(" ");
		const step = parseInt(parts[2].substring(2, parts[2].length - 2), 16);;
		const dir =  parseInt(parts[2].charAt(parts[2].length - 2));

		points.push({dir, step});
		pathCount += step;
	}

	console.log(points);

	let r = 0;
	let c = 0;

	let minr = Number.MAX_SAFE_INTEGER;
	let minc = Number.MAX_SAFE_INTEGER;
	let maxr = -Number.MAX_SAFE_INTEGER;
	let maxc = -Number.MAX_SAFE_INTEGER;
	let coords = [];
	points.forEach((o, i) => {
		if (i > 0) {
			if (o.dir === 3) { // up
				coords[i - 1][2] = false;
			}
			if (o.dir === 1) {
				coords[i - 1][2] = true;
			}
			if ((o.dir === 0 || o.dir === 2) && i > 1) {
				coords[i - 1][2] = !coords[i - 2][2];
			}
		}
		const dr = dirs[o.dir][0];
		const dc = dirs[o.dir][1];

		r += (o.step * dr);
		c += (o.step * dc);

		coords.push([r, c]);

		if (i === points.length - 1) {
			console.log(o);
			coords[i][2] = (o.dir === 3);
		}

		minr = Math.min(minr, r);
		minc = Math.min(minc, c);

		maxr = Math.max(maxr, r);
		maxc = Math.max(maxc, c);
	});

	coords = coords.map(([r, c, down]) => {
		return [r - minr, c - minc, down];
	});

	console.log(coords);

	const cornerMap = coords.reduce((acc, [r, c, down]) => {
		acc[r] ??= [];
		acc[r].push([c, down]);
		return acc;
	}, {});

	const sortedRows = Object.keys(cornerMap).map(s => parseInt(s)).sort((r1, r2) => r1 - r2);
	sortedRows.forEach(r => cornerMap[r].sort((c1, c2) => c1[0] - c2[0]));

	sortedRows.forEach(r => console.log(r, cornerMap[r]));

	function count(columns, from, to) {
		if (to <= from)  {
			console.log("count result: 0!!!!!");
			return 0;
		}

		let result = 0;
		for (c = 0; c < columns.length / 2; c++) {
			result += (columns[2 * c + 1] - columns[2 * c] - 1) * (to - from);
		}

		console.log("count result: ", result);
		return result;
	}

	function countBorder(columns) {
		console.log("border: ", columns);
		let result = 0;
		for (let i = 0; i < columns.length; i+=2) {
			let c1 = Array.isArray(columns[i]) ? columns[i][1] : columns[i];
			let c2 = Array.isArray(columns[i+1]) ? columns[i+1][0] : columns[i+1];

			if (typeof c1 === "string" && typeof c2 === "string") {
				// when both are newly inserted, it's the outer border and shouldn't be counted
				continue;
			}

			if (typeof c1 === "string") {
				c1 = parseInt(c1.substring(0, c1.length - 4));
			}
			if (typeof c2 === "string") {
				c2 = parseInt(c2.substring(0, c2.length - 4));
			}

			result += (c2 - c1 - 1);
		}

		console.log("result: ", result);
		return result;
	}

	const columns = cornerMap[sortedRows[0]].map(c => c[0]);

	let result = pathCount;
	for (let i = 1; i < sortedRows.length ; i++) {
		console.log(columns);
		const row = sortedRows[i];

		result += count(columns, sortedRows[i - 1] + 1, row);

		const borderColumns = columns.slice();
		const corners = cornerMap[row];

		corners.forEach(([c, down]) => {
			if (down) {
				columns.push(c);
			} else {
				let index = columns.indexOf(c);
				columns.splice(index, 1);
				// note!!!!
				borderColumns.splice(index, 1);
			}
		});

		for (let j = 0 ; j < corners.length ; j += 2) {
			const cr1 = corners[j];
			const cr2 = corners[j + 1];

			if (cr1[1] ? !cr2[1] : cr2[1]) {
				borderColumns.push([cr1[0], cr2[0]]);
			} else {
				borderColumns.push(cr1[0] + ":new");
				borderColumns.push(cr2[0] + ":new");
			}
		}

		columns.sort((c1, c2) => c1 - c2);
		borderColumns.sort((c1, c2) => {
			if (Array.isArray(c1)) {
				c1 = c1[0];
			}
			if (Array.isArray(c2)) {
				c2 = c2[0];
			}
			if (typeof c1 === "string") {
				c1 = parseInt(c1.substring(0, c1.length - 4));
			}
			if (typeof c2 === "string") {
				c2 = parseInt(c2.substring(0, c2.length - 4));
			}
			return c1 - c2;
		});

		result += countBorder(borderColumns);
	}

	console.log(`columns left: ${columns}`);

	console.log(result);
}

processLineByLine();
