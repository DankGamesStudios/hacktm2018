import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
// import Plus from '../../assets/images/plus.png';


export default class Boot extends Phaser.State {

    preload(game) {
        this.game.load.image('normal_tile', require('../../assets/images/platform-1.png'));
        this.game.load.image('normal_tile_selected', require('../../assets/images/platform-2.png'));
        this.game.load.image('normal_tile_available', require('../../assets/images/platform-2.png'));

        this.game.load.image('laser', require('../../assets/images/swordSilver.png'));
        this.game.load.image('shield', require('../../assets/images/shieldBronze.png'));

        this.game.load.atlasJSONHash('player',
            require('../../assets/sprites/running_bot.png'),
            require('../../assets/sprites/running_bot.json')
        );

        this.game.load.spritesheet('timer', require('../../assets/images/timer.png'), 150, 20);

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