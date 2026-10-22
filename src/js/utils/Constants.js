export const TILE_SIZE = 16;
export const MAP_COLS = 28;
export const MAP_ROWS = 31;

export const DIRECTION = {
    IDLE: { x: 0, y: 0 },
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

export const TILE_TYPE = {
    EMPTY: 0,
    WALL: 1,
    DOT: 2,
    ENERGIZER: 3,
    PHASE_GATE: 4
};