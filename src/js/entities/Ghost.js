import { TILE_SIZE, DIRECTION } from '../utils/Constants.js';

export const GHOST_MODE = {
    SPAWNING: 'SPAWNING',
    CHASE: 'CHASE',
    FRIGHTENED: 'FRIGHTENED',
    EATEN: 'EATEN'
};

export class Ghost {
    constructor(x, y, color, exitDelay = 0) {
        this.startX = x;
        this.startY = y;
        this.baseColor = color;
        this.exitDelay = exitDelay;
        this.floatOffset = Math.random() * Math.PI;
        this.reset();
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.speed = 2;
        this.direction = DIRECTION.UP;
        this.mode = GHOST_MODE.SPAWNING;
        this.frightenedTimer = 0;
        this.currentDelay = this.exitDelay;
    }

    setFrightened(durationSec) {
        if (this.mode !== GHOST_MODE.EATEN && this.mode !== GHOST_MODE.SPAWNING) {
            this.mode = GHOST_MODE.FRIGHTENED;
            this.frightenedTimer = durationSec * 60;
        }
    }

    handleSpawning() {
        if (this.currentDelay > 0) {
            this.currentDelay--;
            return;
        }

        // Centro horizontal de salida entre las columnas 13 y 14
        const targetX = 13.5 * TILE_SIZE;
        const targetY = 11 * TILE_SIZE; // Casilla libre justo afuera de la puerta

        if (Math.abs(this.x - targetX) > 1) {
            this.direction = this.x < targetX ? DIRECTION.RIGHT : DIRECTION.LEFT;
            this.x += this.direction.x * this.speed;
        } else {
            this.x = targetX;
            this.direction = DIRECTION.UP;
            this.y += this.direction.y * this.speed;

            if (this.y <= targetY) {
                this.y = targetY;
                this.x = Math.floor(this.x / TILE_SIZE) * TILE_SIZE; // Encajar en la grilla
                this.mode = GHOST_MODE.CHASE;
                this.direction = DIRECTION.LEFT;
            }
        }
    }

    update(map, pacman) {
        this.floatOffset += 0.1;

        if (this.mode === GHOST_MODE.SPAWNING) {
            this.handleSpawning();
            return;
        }

        if (this.frightenedTimer > 0) {
            this.frightenedTimer--;
            if (this.frightenedTimer <= 0) {
                this.mode = GHOST_MODE.CHASE;
            }
        }

        const isAlignedX = Number.isInteger(this.x / TILE_SIZE);
        const isAlignedY = Number.isInteger(this.y / TILE_SIZE);

        if (isAlignedX && isAlignedY) {
            const currentCol = Math.round(this.x / TILE_SIZE);
            const currentRow = Math.round(this.y / TILE_SIZE);

            const possibleDirections = [DIRECTION.UP, DIRECTION.LEFT, DIRECTION.DOWN, DIRECTION.RIGHT].filter(dir => {
                if (dir.x === -this.direction.x && dir.y === -this.direction.y) return false;
                // isGhost = true para que la puerta no sea bloqueante
                return !map.isWall(currentCol + dir.x, currentRow + dir.y, false, true);
            });

            if (possibleDirections.length > 0) {
                if (this.mode === GHOST_MODE.FRIGHTENED) {
                    this.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
                } else {
                    let bestDir = possibleDirections[0];
                    let minDistance = Infinity;

                    for (const dir of possibleDirections) {
                        const nextCol = currentCol + dir.x;
                        const nextRow = currentRow + dir.y;
                        const dist = Math.hypot((nextCol * TILE_SIZE) - pacman.x, (nextRow * TILE_SIZE) - pacman.y);
                        if (dist < minDistance) {
                            minDistance = dist;
                            bestDir = dir;
                        }
                    }
                    this.direction = bestDir;
                }
            }
        }

        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;

        // Soporte para cruzar el túnel lateral
        const totalWidth = map.grid[0].length * TILE_SIZE;
        if (this.x < -TILE_SIZE / 2) this.x = totalWidth - TILE_SIZE / 2;
        if (this.x > totalWidth - TILE_SIZE / 2) this.x = -TILE_SIZE / 2;
    }

    render(ctx) {
        ctx.save();
        const centerX = this.x + TILE_SIZE / 2;
        const wave = Math.sin(this.floatOffset) * 1.5;
        const centerY = this.y + TILE_SIZE / 2 + wave;
        const radius = TILE_SIZE / 2 - 1;

        ctx.beginPath();
        ctx.arc(centerX, centerY - 2, radius, Math.PI, 0, false);
        ctx.lineTo(centerX + radius, centerY + radius);
        ctx.quadraticCurveTo(centerX + radius / 2, centerY + radius - 3, centerX, centerY + radius);
        ctx.quadraticCurveTo(centerX - radius / 2, centerY + radius + 2, centerX - radius, centerY + radius);
        ctx.closePath();

        if (this.mode === GHOST_MODE.FRIGHTENED) {
            ctx.fillStyle = this.frightenedTimer < 120 && Math.floor(this.frightenedTimer / 10) % 2 === 0 ? '#ffffff' : '#3a0ca3';
            ctx.shadowColor = '#4cc9f0';
        } else {
            ctx.fillStyle = this.baseColor;
            ctx.shadowColor = this.baseColor;
        }
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#0f051d';
        ctx.beginPath();
        ctx.ellipse(centerX - 3, centerY - 2, 2, 3, 0, 0, Math.PI * 2);
        ctx.ellipse(centerX + 3, centerY - 2, 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffeedd';
        ctx.beginPath();
        ctx.arc(centerX - 3 + this.direction.x * 0.8, centerY - 2 + this.direction.y * 0.8, 1, 0, Math.PI * 2);
        ctx.arc(centerX + 3 + this.direction.x * 0.8, centerY - 2 + this.direction.y * 0.8, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}