const dp = (pos, count, array) => {
	if (pos < array.length) {
		let b1, b2;
		// b1 is the result that do not select the element at pos
		// b2 is the result that consider the element at pos
		b1 = dp(pos + 1, count, array);

		if (count === 1) {
			b2 = [[array[pos]]];
		} else {
			b2 = dp(pos + 1, count - 1, array);
			b2.forEach((c) => {
				c.push(array[pos]);
			});
		}

		return b1.concat(b2);
	} else {
		return [];
	}
};

export default (size, count) => {
	// create array of elements from 0, 1, ..., size - 1
	const array = Array.from({length: size}, (e, i) => {
		return i;
	});

	return dp(0, count, array);
};
