import { GameState } from './GameState.js';
import { GameOverState } from './GameOverState.js';
import { checkEntityCollision } from '../utils/Collision.js';
import { GHOST_MODE } from '../entities/Ghost.js';

export class PlayState extends GameState {
    constructor(game) {
        super(game);
        this.onEatDot = this.onEatDot.bind(this);
        this.onEatEnergizer = this.onEatEnergizer.bind(this);
    }

    enter() {
        window.addEventListener('eat-dot', this.onEatDot);
        window.addEventListener('eat-energizer', this.onEatEnergizer);
    }

    exit() {
        window.removeEventListener('eat-dot', this.onEatDot);
        window.removeEventListener('eat-energizer', this.onEatEnergizer);
    }

    onEatDot(event) {
        this.game.score += event.detail.points;
    }

    onEatEnergizer(event) {
        this.game.score += event.detail.points;
        for (const ghost of this.game.ghosts) {
            ghost.setFrightened(7);
        }
    }

    update() {
        this.game.pacman.update(this.game.map, this.game.input);

        for (const ghost of this.game.ghosts) {
            ghost.update(this.game.map, this.game.pacman);

            if (checkEntityCollision(this.game.pacman, ghost)) {
                // Si Pacman esta en fase, se anula la colision
                if (this.game.pacman.isPhasing) {
                    continue;
                }

                if (ghost.mode === GHOST_MODE.FRIGHTENED) {
                    this.game.score += 200;
                    ghost.reset();
                } else {
                    this.game.lives--;
                    if (this.game.lives <= 0) {
                        this.game.setState(new GameOverState(this.game));
                        return;
                    } else {
                        this.game.pacman.reset();
                        for (const g of this.game.ghosts) g.reset();
                    }
                }
            }
        }
    }

    render(ctx) {
        this.game.map.render(ctx);
        this.game.pacman.render(ctx);
        for (const ghost of this.game.ghosts) {
            ghost.render(ctx);
        }
    }
}