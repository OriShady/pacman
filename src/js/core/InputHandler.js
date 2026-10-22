import { DIRECTION } from '../utils/Constants.js';

export class InputHandler {
    constructor() {
        this.currentDirection = DIRECTION.IDLE;
        this.nextDirection = DIRECTION.IDLE;
        this.isPhaseActive = false;

        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.nextDirection = DIRECTION.UP;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.nextDirection = DIRECTION.DOWN;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.nextDirection = DIRECTION.LEFT;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.nextDirection = DIRECTION.RIGHT;
                break;
            case 'Space':
            case 'ShiftLeft':
            case 'ShiftRight':
                this.isPhaseActive = true;
                break;
        }
    }

    onKeyUp(event) {
        if (event.code === 'Space' || event.code.startsWith('Shift')) {
            this.isPhaseActive = false;
        }
    }
}