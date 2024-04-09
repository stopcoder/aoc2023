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

// TODO: try big.js to see whether the precision can be improved
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



	function intersect(i, j, vx, vy) {
		if (rays[i][1][0] === vx || rays[j][1][0] === vx) {
			return false;
		}

		const a1 = (rays[i][1][1] - vy) / (rays[i][1][0] - vx);
		const a2 = (rays[j][1][1] - vy) / (rays[j][1][0] - vx);

		if (a1 === a2) {
			return false;
		}

		const x = ((rays[j][0][1] - rays[i][0][1]) - (a2 * rays[j][0][0] - a1 * rays[i][0][0])) / (a1 - a2);
		const y = a1 * x + rays[i][0][1] - (a1 * rays[i][0][0]);

		if (isNaN(x)) {
			debugger;
		}

		return [x, y];
	}

	function intersectZ(i, j, vy, vz) {
		if (rays[i][1][1] === vy || rays[j][1][1] === vy) {
			return false;
		}

		const a1 = (rays[i][1][2] - vz) / (rays[i][1][1] - vy);
		const a2 = (rays[j][1][2] - vz) / (rays[j][1][1] - vy);

		if (a1 === a2) {
			return false;
		}

		const y = ((rays[j][0][2] - rays[i][0][2])  - (a2 * rays[j][0][1] - a1 * rays[i][0][1])) / (a1 - a2);
		const z = a1 * y + rays[i][0][2] - (a1 * rays[i][0][1]);

		return [y, z];
	}

	let rx, ry, rz, vrx, vry, vrz;
	for (let vx = -1000; vx <= 1000; vx++) {
		for (let vy = -1000; vy <= 1000; vy++) {
			let found = false;
			let point;
			for (let j = 1; j < rays.length; j++) {
				if (!point) {
					point = intersect(0, j, vx, vy);
				} else {
					const newPoint = intersect(0, j, vx, vy);

					if (newPoint && (Math.abs(newPoint[0] - point[0]) > 3 || Math.abs(newPoint[1] -  point[1]) > 3)) {
						found = false;
						break;
					} else {
						found = true;
					}
				}
			}
			if (found) {
				[rx, ry] = point;
				vrx = vx;
				vry = vy;
				break;
			}
		}
	}

	console.log(rx, ry);
	console.log(vrx, vry);

	for (let vz = -1000; vz <= 1000; vz++) {
		let found = false;
		let point;
		for (let j = 1; j < rays.length; j++) {
			if (!point) {
				point = intersectZ(0, j, vry, vz);
			} else {
				const newPoint = intersectZ(0, j, vry, vz);

				if (newPoint && (Math.abs(newPoint[0] - point[0]) > 30 || Math.abs(newPoint[1] -  point[1]) > 30)) {
					found = false;
					break;
				} else {
					found = true;
				}
			}
		}
		if (found) {
			console.log(vz);
			console.log(point);
			vrz = vz;
			rz = point[1];
			break;
		}
	}

	console.log([rx, ry, rz, vrx, vry, vrz]);

	const answer = rx + ry + rz;
	console.log(answer);


}

processLineByLine();
