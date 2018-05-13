import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

export default class GameOver extends Phaser.State {

    constructor(game, gameManager) {
        super(game);
        this.gameManager = gameManager;
    }

    preload(game) {
    }

    create(game) {
        console.log('game over state');
        let status = '';
        if (this.gameManager.gameState == 'draw') {
            status = 'Draw. Rematch ?';
        } else if (this.gameManager.winner == this.gameManager.playerId) {
            status = 'Congratulations!';
        } else {
            status = 'Game over!';
        }
        this.statusText = this.game.add.text(
            this.game.world.centerX, this.game.world.centerY,
            status,
            {font: '50px', fill: '#de0000', align: 'center'});
        // this.statusText.anchor.set(0.5, 0.5);
        // this.playText = this.game.add.text(
        //     this.game.world.centerX, 600,
        //     'Play',
        //     {font: '50px', fill: '#9eff63', align: 'center'});
        // this.playText.anchor.set(0.5, 0.5);
        // this.playText.inputEnabled = true;
        // this.playText.events.onInputDown.add(() => {
        //     this.game.state.start('Game');
        // }, this);
    };

    update(game) {
    };
};
