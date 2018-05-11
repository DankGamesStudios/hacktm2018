import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

export default class Game extends Phaser.State {

    preload(game) {

    }

    create(game) {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'plus');
        logo.anchor.setTo(0.5, 0.5);
        console.log('Game state');
    };

    update(game) {
        // ¯ \_(ツ)_/¯
        // "surprise me"
    };
};