import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';


export default class Boot extends Phaser.State {

// export default {
//     Boot: new Phaser.State({preload: preload, create: create, update: update})
// }

    preload() {
        this.game.load.image('logo', './assets/images/phaser.png');
    }

    create() {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        console.log('boot state');
        this.game.state.start('Menu');
    };

    update() {
        // ¯ \_(ツ)_/¯
        // "surprise me"
    };
}