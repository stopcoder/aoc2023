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
/*
 * 
 * 6 Five of a kind, where all five cards have the same label: AAAAA
 *   1
 * 5 Four of a kind, where four cards have the same label and one card has a different label: AA8AA
 *   2 max(length) = 4
 * 4 Full house, where three cards have the same label, and the remaining two cards share a different label:
 *   23332
 *   2 max(length) = 3
 * 3 Three of a kind, where three cards have the same label, and the remaining two cards are each different
 *   from any other card in the hand: TTT98
 *   3 max(length) = 3
 * 2 Two pair, where two cards share one label, two other cards share a second label, and the remaining card
 *   has a third label: 23432
 *   3 max(length) = 2
 * 1 One pair, where two cards share one label, and the other three cards have a different label from the
 *   pair and each other: A23A4 
 *   4
 * 0 High card, where all cards' labels are distinct: 23456
 *   5
 */

async function processLineByLine() {
	const letters = "J23456789TQKA";

	function getKind(hand) {
		const map = hand.split("").reduce((acc, char) => {
			acc[char] ??= 0;
			acc[char]++;
			return acc;
		}, {});

		const jCount = map["J"];
		delete map["J"];
		const keyCount = Object.keys(map).length;
		let maxLength = Math.max.apply(null, Object.values(map));
		if (jCount) {
			maxLength += jCount;
		}

		if (keyCount === 5) {
			return 0;
		} else if (keyCount === 4) {
			return 1;
		} else if (keyCount === 3) {
			if (maxLength === 2) {
				return 2;
			} else {
				return 3;
			}
		} else if (keyCount === 2) {
			if (maxLength === 3) {
				return 4;
			} else {
				return 5;
			}
		} else {
			return 6;
		}
	};

	function compareLetter(h1, h2) {
		for (let i = 0; i < h1.length; i++) {
			const pos1 = letters.indexOf(h1[i]);
			const pos2 = letters.indexOf(h2[i]);
			if (pos1 !== pos2) {
				return pos1 - pos2;
			}
		}
	}

	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const data = [];

	for await (const line of rl) {
		const parts = line.split(" ");
		data.push([parts[0], parseInt(parts[1])]);
	}

	data.sort((d1, d2) => {
		const h1 = d1[0];
		const h2 = d2[0];

		const k1 = getKind(h1);
		const k2 = getKind(h2);

		if (k1 !== k2) {
			return k1 - k2;
		} else {
			return compareLetter(h1, h2);
		}
	});

	const result = data.reduce((acc, d, i) => {
		return acc + (d[1] * (i + 1));
	}, 0);

	console.log(result);
}

processLineByLine();
