import { generateConvertibleGraph, graphToGrid, randomGraph } from "./src/Functions";
import { displayGrid } from "./src/Display";


const graph = generateConvertibleGraph(30);

// const startTime = performance.now();

const grid = graphToGrid(graph);

if (grid) {
	displayGrid(grid);
} else {
	console.log("Graph is not convertible to a grid");
}

// const endTime = performance.now();
// console.log(`Execution time: ${endTime - startTime} milliseconds`);



