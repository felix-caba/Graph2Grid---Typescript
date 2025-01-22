import { Graph } from "./Graph";
import { Grid } from "./Grid";


function graphToGrid(graph: Graph): Grid | undefined {

    // Reject graphs with nodes having more than 4 neighbors

    if (Object.values(graph).some(n => n.neighbors.length > 4)) return undefined;

    const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];

    function tryToPlaceTile(grid: Grid, id: number, x: number, y: number): Grid | undefined {
        // Check if position is already occupied
        if (Object.values(grid.locations).some(([px, py]) => px === x && py === y)) { return undefined; }

        // Find placed neighbors at current position
        const placedNeighbors = new Set( // New Set of filtered neighbors
            dirs.map(([dx, dy]) => {
                const pos = [x + dx, y + dy] as [number, number];
                // Positions are dirX and dirY added to x and y, for each direction new entry on set
                return Object.entries(grid.locations).find(([_, [px, py]]) => px === pos[0] && py === pos[1])?.[0];
                // Returns the key of the entry that has the same x and y as the current position
            }).filter((id): id is string => id !== undefined).map(Number)
        );

        // This are the neighbors that should be placed in the grid getting the ID of the actual node 
        const alreadyIntendedPlacedNeighbors = new Set(
            graph[id].neighbors.filter(n2 => n2 in grid.locations)
        );

        // Check if placed neighbors match intended neighbors, if not, there is an inconsistency
        if (placedNeighbors.symmetricDifference(alreadyIntendedPlacedNeighbors).size) {return undefined;}

        // Place the tile
        const newGrid: Grid = {
            locations: { ...grid.locations, [id]: [x, y] as [number, number] }
        };

        // If all nodes are placed, we are done
        if (Object.keys(newGrid.locations).length === Object.keys(graph).length) {
            return newGrid;
        }

        // Find an unplaced tile that has a placed neighbor
        const unplacedTile = Object.keys(graph)
            .map(Number)
            .find(n => !(n in newGrid.locations) &&
                graph[n].neighbors.some(n2 => n2 in newGrid.locations));

        if (unplacedTile === undefined) {
            return newGrid;
        }

        // Get position of a placed neighbor that has the unplaced tile as neighbor
        const placedNeighbor = graph[unplacedTile].neighbors.find(n2 => n2 in newGrid.locations)!;
        const [newX, newY] = newGrid.locations[placedNeighbor];

        // Try placing in each direction
        for (const [dx, dy] of dirs) {
            const nextGrid = tryToPlaceTile(newGrid, unplacedTile, newX + dx, newY + dy);
            if (nextGrid) return nextGrid;
        }

        return undefined;
    }

    const firstTile = Number(Object.keys(graph)[0]);
    return tryToPlaceTile({ locations: {} }, firstTile, 0, 0);
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

export { graphToGrid, randomGraph }