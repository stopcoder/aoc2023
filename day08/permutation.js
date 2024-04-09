const dp = (array) => {
	if (array.length === 1) {
		return [array.slice()];
	}

	const result = [];

	for (let i = 0; i < array.length; i++) {
		let e = array.shift();
		const perms = dp(array);

		perms.forEach((perm) => {
			perm.push(e);
			result.push(perm);
		});

		array.push(e);
	}

	return result;
};

export default (count) => {
	const array = Array.from({length: count}, (e, i) => i);

	return dp(array);
};
