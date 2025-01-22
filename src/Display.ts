import { Grid } from "./Grid";


export function displayGrid(grid: Grid) {

    /**
     * Get the x and y values of the grid.
     */
    const xs = Object.values(grid.locations).map(([x, _]) => x);
    const ys = Object.values(grid.locations).map(([_, y]) => y);
 
    /**
     * Gets the smallest and biggest values of the grid.
     */
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);

    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);

    let ret = "";
    for (let x = xMin; x <= xMax; x++) {
        ret += "\n|"
        for (let y = yMin; y <= yMax; y++) {
            //ret += String(grid.grid[x]?.[y] ?? " ").padEnd(3) + "|";
            ret += String(Object.keys(grid.locations).find(k => 
                grid.locations[Number(k)][0] === x && grid.locations[Number(k)][1] === y) ?? " ").padEnd(3) + "|";
        }
    }
    console.log(ret);
}
