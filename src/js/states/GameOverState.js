import { GameState } from './GameState.js';

export class GameOverState extends GameState {
    render(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = '#ff0055';
        ctx.font = '24px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('FIN DEL JUEGO', ctx.canvas.width / 2, ctx.canvas.height / 2 - 20);

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px "Courier New", monospace';
        ctx.fillText('Presiona ESPACIO para reiniciar', ctx.canvas.width / 2, ctx.canvas.height / 2 + 20);
    }

    update() {
        if (this.game.input.isPhaseActive) {
            this.game.resetGame();
        }
    }
}