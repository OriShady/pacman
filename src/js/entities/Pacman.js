import { TILE_SIZE, DIRECTION, TILE_TYPE } from '../utils/Constants.js';

export class Pacman {
    constructor(x, y) {
        this.startX = x;
        this.startY = y;
        this.reset();
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = DIRECTION.IDLE;
        this.nextDirection = DIRECTION.IDLE;
        this.speed = 2;
        this.phaseEnergy = 100;
        this.isPhasing = false;
        this.radius = TILE_SIZE / 2 - 1;
        this.angle = 0.2;
        this.angleSpeed = 0.02;
    }

    update(map, input) {
        if (input.isPhaseActive && this.phaseEnergy > 0) {
            this.isPhasing = true;
            this.phaseEnergy = Math.max(0, this.phaseEnergy - 0.7);
        } else {
            this.isPhasing = false;
            this.phaseEnergy = Math.min(100, this.phaseEnergy + 0.2);
        }

        this.nextDirection = input.nextDirection;

        const isAlignedX = this.x % TILE_SIZE === 0;
        const isAlignedY = this.y % TILE_SIZE === 0;

        if (isAlignedX && isAlignedY) {
            const currentTileX = Math.floor(this.x / TILE_SIZE);
            const currentTileY = Math.floor(this.y / TILE_SIZE);

            if (this.canMove(currentTileX + this.nextDirection.x, currentTileY + this.nextDirection.y, map)) {
                this.direction = this.nextDirection;
            }

            if (!this.canMove(currentTileX + this.direction.x, currentTileY + this.direction.y, map)) {
                this.direction = DIRECTION.IDLE;
            }

            if (!this.isPhasing) {
                const tile = map.grid[currentTileY][currentTileX];
                if (tile === TILE_TYPE.DOT) {
                    map.grid[currentTileY][currentTileX] = TILE_TYPE.EMPTY;
                    window.dispatchEvent(new CustomEvent('eat-dot', { detail: { points: 10 } }));
                } else if (tile === TILE_TYPE.ENERGIZER) {
                    map.grid[currentTileY][currentTileX] = TILE_TYPE.EMPTY;
                    window.dispatchEvent(new CustomEvent('eat-energizer', { detail: { points: 50 } }));
                }
            }
        }

        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;

        const totalWidth = map.grid[0].length * TILE_SIZE;
        if (this.x < -TILE_SIZE / 2) this.x = totalWidth - TILE_SIZE / 2;
        if (this.x > totalWidth - TILE_SIZE / 2) this.x = -TILE_SIZE / 2;

        this.angle += this.angleSpeed;
        if (this.angle >= 0.38 || this.angle <= 0.05) {
            this.angleSpeed = -this.angleSpeed;
        }
    }

    canMove(targetCol, targetRow, map) {
        return !map.isWall(targetCol, targetRow, this.isPhasing);
    }

    render(ctx) {
        ctx.save();
        const centerX = this.x + TILE_SIZE / 2;
        const centerY = this.y + TILE_SIZE / 2;

        let rotation = 0;
        if (this.direction === DIRECTION.UP) rotation = 1.5 * Math.PI;
        if (this.direction === DIRECTION.DOWN) rotation = 0.5 * Math.PI;
        if (this.direction === DIRECTION.LEFT) rotation = Math.PI;

        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);

        // Cuerpo de calabaza
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, this.angle * Math.PI, (2 - this.angle) * Math.PI);
        ctx.lineTo(0, 0);

        if (this.isPhasing) {
            ctx.fillStyle = '#70e000';
            ctx.shadowBlur = 14;
            ctx.shadowColor = '#70e000';
            ctx.globalAlpha = 0.65;
        } else {
            ctx.fillStyle = '#ff7518';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ff5400';
            ctx.globalAlpha = 1.0;
        }
        ctx.fill();

        // Tallo de la calabaza
        ctx.fillStyle = '#38b000';
        ctx.fillRect(-2, -this.radius - 2, 4, 3);

        // Ojo tallado triangular
        ctx.fillStyle = '#2b0938';
        ctx.beginPath();
        ctx.moveTo(1, -4);
        ctx.lineTo(4, -1);
        ctx.lineTo(-2, -1);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}