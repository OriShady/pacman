import { Map } from './Map.js';
import { InputHandler } from './InputHandler.js';
import { Pacman } from '../entities/Pacman.js';
import { Ghost } from '../entities/Ghost.js';
import { PlayState } from '../states/PlayState.js';
import { TILE_SIZE } from '../utils/Constants.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.input = new InputHandler();
        this.scoreDisplay = document.getElementById('score-display');
        this.livesDisplay = document.getElementById('lives-display');
        this.phaseBar = document.getElementById('phase-bar');

        this.init();
    }

    init() {
        this.map = new Map();
        
        // Coordenadas alineadas en celdas transitables
        this.pacman = new Pacman(13 * TILE_SIZE, 23 * TILE_SIZE);
        
        // Posiciones iniciales dentro del corral de fantasmas
        this.ghosts = [
            new Ghost(13 * TILE_SIZE, 14 * TILE_SIZE, '#9d4edd', 0),    // Sale de inmediato
            new Ghost(14 * TILE_SIZE, 14 * TILE_SIZE, '#52b788', 120),  // Sale a los 2 segundos
            new Ghost(12 * TILE_SIZE, 14 * TILE_SIZE, '#e85d04', 240),  // Sale a los 4 segundos
            new Ghost(15 * TILE_SIZE, 14 * TILE_SIZE, '#e2eafc', 360)   // Sale a los 6 segundos
        ];

        this.score = 0;
        this.lives = 3;
        this.currentState = null;
        this.setState(new PlayState(this));
    }

    resetGame() {
        this.init();
    }

    setState(newState) {
        if (this.currentState) {
            this.currentState.exit();
        }
        this.currentState = newState;
        this.currentState.enter();
    }

    start() {
        const loop = () => {
            this.update();
            this.render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update() {
        if (this.currentState) {
            this.currentState.update();
        }

        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = String(this.score).padStart(4, '0');
        }
        if (this.livesDisplay) {
            this.livesDisplay.textContent = this.lives;
        }
        if (this.phaseBar && this.pacman) {
            this.phaseBar.style.width = `${Math.max(0, this.pacman.phaseEnergy)}%`;
        }
    }

    render() {
        this.ctx.fillStyle = '#08030d';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.currentState) {
            this.currentState.render(this.ctx);
        }
    }
}