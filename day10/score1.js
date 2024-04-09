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

	const map = [];
	for await (const line of rl) {
		map.push(line.split(""));
	}

	/*
	 * | is a vertical pipe connecting north and south.
	 * - is a horizontal pipe connecting east and west.
	 * L is a 90-degree bend connecting north and east.
	 * J is a 90-degree bend connecting north and west.
	 * 7 is a 90-degree bend connecting south and west.
	 * F is a 90-degree bend connecting south and east.
	 * . is ground; there is no pipe in this tile.
	 * S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
	 */

	const delta = [
		// up, right, down, left
		[-1, 0], [0, 1], [1, 0], [0, -1]
	];
	const up = ["7", "|", "F"];
	const down = ["|", "J", "L"];
	const left = ["-", "L", "F"];
	const right = ["7", "-", "J"];

	/**
	 * One example, to right, "LJ", "L-J" can be sqeezed through, but "L-7" can't.
	 * To each direction, two regexes are defined in order to replace them so that the sqeezed isn't count
	 */
	// up, right, down, left
	const sqeeze = [
		[/L\|*F/g, /J\|*7/g],
		[/F\-*7/g, /L\-*J/g],
		[/F\|*L/g, /7\|*J/g],
		[/7\-*F/g, /J\-*L/g]
	];

	// up, right, down, left
	const boundary = [
		{"-": 1, "|": 0, "L": 0.5, "F": 0.5, "J": 0.5, "7": 0.5},
		{"|": 1, "-": 0, "L": 0.5, "F": 0.5, "J": 0.5, "7": 0.5},
		{"-": 1, "|": 0, "L": 0.5, "F": 0.5, "J": 0.5, "7": 0.5},
		{"|": 1, "-": 0, "L": 0.5, "F": 0.5, "J": 0.5, "7": 0.5}
	];

	let connectivity = {
		"|": [up, [], down, []],
		"-": [[], right, [], left],
		"L": [up, right, [], []],
		"J": [up, [], [], left],
		"7": [[], [], down, left],
		"F": [[], right, down, []],
		"S": [up, right, down, left]
	};

	/**
	 * find 'S' coordinate and replace it with the approparate letter
	 */
	let sr, sc;
	for (let i = 0; i < map.length; i++) {
		const row = map[i];
		for (let j = 0; j < row.length; j++) {
			const char = row[j];

			if (char === "S") {
				sr = i;
				sc = j;
				const connectS = delta.map((d, index) => {
					const r = i + d[0];
					const c = j + d[1];

					if (r >= 0 && r < map.length && c >= 0 && c < map[r].length) {
						const neighbour = map[r][c];

						if (connectivity[char][index].includes(neighbour)) {
							return 3;
						} else {
							return 0;
						}
					} else {
						return 0;
					}
				});

				const charS = Object.keys(connectivity).filter((char) => {
					const connect = connectivity[char];
					return connect.every((element, index) => {
						return element.length === connectS[index];
					});
				});

				console.log(charS[0]);
				map[i][j] = charS[0];
			}
		}
	}

	/**
	 * Calculate the loop and save the visited index in 'visited'
	 */
	const visited = new Set();
	console.log(`start: ${sr},${sc}`);
	const queue = [[sr, sc, 0]];
	let lastVisited;

	while (queue.length) {
		const current = queue.shift();
		const key = `${current[0]},${current[1]}`;
		const char = map[current[0]][current[1]];
		if (visited.has(key)) {
			continue;
		}

		visited.add(key);
		lastVisited = current;
		delta.forEach((d, index) => {
			const x = current[0] + d[0];
			const y = current[1] + d[1];

			if (x >= 0 && x < map.length && y >=0 && y <= map[x].length) {
				const connect = connectivity[char][index];
				if (connect && connect.includes(map[x][y])) {
					queue.push([x, y, current[2] + 1]);
				}
			}
		});
	}

	console.log(lastVisited[2]);
	console.log(visited.size);

	/**
	 * calculate how many times one point will cross over the loop path moving towards the given direction
	 * (index)
	 */
	function score(sr, sc, index) {
		const d = delta[index];
		let row = sr + d[0];
		let column = sc + d[1];

		let track = "";
		while (row >= 0 && row < map.length && column >= 0 && column < map[row].length) {
			const key = `${row},${column}`;
			if (visited.has(key)) {
				track += map[row][column];
			}
			row = row + d[0];
			column = column + d[1];
		}

		console.log(`${sr}, ${sc} direction ${index}: ${track}`);

		sqeeze[index].forEach(r => {
			track = track.replace(r, "");
		});
		console.log(`after sqeeze: ${track}`);

		const s = track.split("").reduce((acc, c) => acc + boundary[index][c], 0);

		console.log(`score: ${s}`);
		console.log("");

		return s;
	}

	let result = 0;
	map.forEach((row, r) => {
		row.forEach((char, c) => {
			const key = `${r},${c}`;

			if (!visited.has(key)) {
				/**
				 * if for all directions, the cross over time with the loop is odd, the point is within the
				 * loop
				 */
				const valid = delta.every((d, index) => {
					return score(r, c, index) % 2 === 1;
				});

				if (valid) {
					result++;
				}
			}
		});
	});

	console.log(result);
}

processLineByLine();
