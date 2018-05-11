import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
// import Plus from '../../assets/images/plus.png';


export default class Boot extends Phaser.State {

    preload(game) {
        this.game.load.image('plus', require('../../assets/images/plus.png'));
        this.game.load.image('minus', require('../../assets/images/minus.png'));
    }

    create(game) {
        console.log('Boot state');
        this.game.state.start('Menu');
    };

    update(game) {
        // ¯ \_(ツ)_/¯
        // "surprise me"
    };
}