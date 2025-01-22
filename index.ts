import { graphToGrid, randomGraph } from "./src/Functions";
import { displayGrid } from "./src/Display";

const exampleGraph = randomGraph(5);
const grid = graphToGrid(exampleGraph);

for (const node in exampleGraph) {
	console.log(node, exampleGraph[node].neighbors);
}

if (grid) {
	displayGrid(grid);
} else {
	console.error("Failed to convert graph to grid.");
}

