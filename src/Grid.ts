export interface Grid {
    grid: { [x: string]: { [y: string]: number } }
    unplaced: Set<number>;
    locations: { [id: number]: [x: number, y: number] }
}

