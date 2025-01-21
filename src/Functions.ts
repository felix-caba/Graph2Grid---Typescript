import { Graph } from "./Graph";
import { Grid } from "./Grid";

function placeTile(grid: Grid, id: number, x: number, y: number): Grid {
    if (!grid.unplaced.has(id)) throw new Error("Not unplaced");
    if (grid.grid[x]?.[y] !== undefined) throw new Error("Tile already placed there");
    return {
        grid: { ...grid.grid, [x]: { ...grid.grid[x], [y]: id } },
        unplaced: grid.unplaced.difference(new Set([id])),
        locations: { ...grid.locations, [id]: [x, y] }
    }
} 


function graphToGrid(graph: Graph): Grid | undefined {

    // Undefined if has more than 4 neighbors 
    if (Object.values(graph).some(n => n.neighbors.length > 4)) return undefined;

    // The four directions avaliable in the grid
    const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];

    // Empty grid with all the nodes unplaced 
    const emptyGrid: Grid = {                               
        grid: {},
        locations: {},
        unplaced: new Set(Object.keys(graph).map(x => Number(x)))
    }
    

    function tryToPlaceTile(grid: Grid, id: number, x: number, y: number): Grid | undefined {

        // If the node is already placed, return undefined 
        if (grid.grid[x]?.[y] !== undefined) { return undefined }
        /**
         *   Picks the X & Y positions and the directions and looks for neighbors, looking up, down, left and right.
         *   If there is neighbors they are placed inside a set. This is done by taking the reference of the X and adding DX ( Deltas )
         *   and DY ( Deltas ) that represent the directions.
         * */
        const placedNeighbors = new Set(dirs.map(([dx, dy]) =>
            grid.grid[x + dx]?.[y + dy]).filter(x => x !== undefined));
        /**
         * Picks up the neighbors that are placed but maybe not in the right position, because they are maybe not adyacent to the node.
         * This is done by looking at the neighbors of the node and checking if they are placed in the grid.
         */
        const intendedPlacedNeighbors = new Set(graph[id].neighbors.filter(n2 =>
            !grid.unplaced.has(n2)));

        /**
         * If there is a difference beetween the placed neighbors and the ones that are supposed to be in the node, return undefined,
         * because there is an unconsistency in the grid.
         */
        if (placedNeighbors.symmetricDifference(intendedPlacedNeighbors).size) {return undefined}

        // Places the node in the Grid 
        grid = placeTile(grid, id, x, y);

        // If unplaced is empty, return the grid. Finished
        if (grid.unplaced.size === 0) return grid;

        // Picks a node that is not yet placed and has a neighbor that is placed
        const unplacedTile = (
            Array.from(grid.unplaced)
        ).find(n => graph[n].neighbors.some(n2 => !grid.unplaced.has(n2)));

        // If it is undefined it means that there is a disconnection or that there are no nodes left to place and everything is already placed.
        if (unplacedTile === undefined) { return grid; }
        
        // Picks up the position of a node that is already placed & is neighbor of a node that is not yet put
        const [newX, newY] = grid.locations[graph[unplacedTile].neighbors.find(n2 => !grid.unplaced.has(n2))!];
       
        // For each direction possible, tries to put the node in that direction checking each direction
        for (const [dx, dy] of (dirs)) {
            console.log( "Trying to put the node " + unplacedTile + " in " + (newX + dx) + " " + (newY + dy) )

            // Gives the grid back if it works. Calls the function again recuersively until there is no more paths avaliable. 

            const nextGrid = tryToPlaceTile(grid, unplacedTile, newX + dx, newY + dy);

            console.log("Next Grid" + nextGrid)

            if (nextGrid) return nextGrid;
        }



        return undefined;

    }

    const firstTile = (Array.from(emptyGrid.unplaced))[0];
    if (firstTile === undefined) return emptyGrid;

    return tryToPlaceTile(emptyGrid, firstTile, 0, 0);

}

function gridToGraph(grid: Grid): Graph {
    const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    return Object.fromEntries(Object.entries(grid.locations).map(
        ([k, [x, y]]) => [k, {
            neighbors: dirs.map(([dx, dy]) =>
                grid.grid[x + dx]?.[y + dy]
            ).filter(n => n !== undefined)
        }]));
}
 

function randomGraph(numNodes: number): Graph {
    const graph: Graph = {}
    for (let i = 0; i < numNodes; i++) {
        graph[i] = { neighbors: [] }
    }
    for (let i = 0; i < numNodes; i++) {
        let g = i;
        while ((g === i) || (graph[g].neighbors.includes(i))) {
            g = Math.floor(Math.random() * numNodes);
        }
        graph[i].neighbors.push(g);
        graph[g].neighbors.push(i);
    }
    return graph;
}

export { placeTile, graphToGrid, gridToGraph, randomGraph }