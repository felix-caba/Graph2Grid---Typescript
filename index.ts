import { graphToGrid, gridToGraph, randomGraph } from "./src/Functions";
import { displayGrid } from "./src/Display";

const exampleGraph = randomGraph(5);
const grid = graphToGrid(exampleGraph);

if (grid) {
	displayGrid(grid);
} else {
	console.error("Failed to convert graph to grid.");
}

