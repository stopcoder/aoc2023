import fs from 'fs';
import readline from 'readline';
import * as Combinatorics from 'js-combinatorics';

const { Combination } = Combinatorics;

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const packs = [];

	for await (const line of rl) {
		packs.push(parseInt(line));
	}

	let it = new Combination(packs, 6);
	console.log(it.length);
	let count = 0;
	for (const elem of it) {
		if (elem.reduce((acc, e) => acc + e) === 508) {
			console.log(elem) // ['a', 'b', 'c', 'd'] ... ['e', 'f', 'g', 'h']
			count++;
		}
	}
	console.log(count);
}

processLineByLine();

