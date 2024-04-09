let record;

const findMinCut = function (vertices, edges) {
	if (vertices.length === 2) {
		return edges;
	}

	// remove edge and vertex at one end of this edge
	function removeEdge() {
		var m = Math.floor(Math.random() * edges.length);
		var edge = edges[m];
		var n1 = edge[0];
		var n2 = edge[1];

		if (record.has(n1)) {
			record.get(n1).push(n2);
		} else {
			record.set(n1, [n2]);
		}

		edges.splice(m, 1);
		vertices.splice(vertices.indexOf(n2), 1);

		return [n1, n2];
	};

	function contract(edge) {
		var n1 = edge[0];
		var n2 = edge[1];

		edges.forEach(function (e) {
			if (e[0] === n2) {
				e[0] = n1;
			}
			if (e[1] === n2) {
				e[1] = n1;
			}
		});
	};

	function removeLoops() {
		for (let i = edges.length - 1; i >= 0; i--) {
			if (edges[i][0] === edges[i][1]) {
				edges.splice(i, 1);
			}
		}
	};

	var edge = removeEdge();
	contract(edge);
	removeLoops();

	return findMinCut(vertices, edges);
};

export default function (vertices, edges) {
	record = new Map();
	return [findMinCut(vertices, edges), record];
}
