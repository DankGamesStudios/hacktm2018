/**
 * Import Phaser dependencies using `expose-loader`.
 * This makes then available globally and it's something required by Phaser.
 * The order matters since Phaser needs them available before it is imported.
 */

import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
import Boot from './states/boot';
// import Preload from 'states/preload';
import Menu from './states/menu';
// import Game from 'states/game';
/**
 * Create a new Phaser game instance.
 * And render a single sprite so we make sure it works.
 */

// var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
//
// function preload() {
//   game.load.image('logo', './assets/images/phaser.png');
// }
//
// function create() {
//   var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
//   logo.anchor.setTo(0.5, 0.5);
// };
//
// function update() {
//   // ¯ \_(ツ)_/¯
//   // "surprise me"
// }


var game = new Phaser.Game(800, 600, Phaser.AUTO);
game.state.add('Boot', new Boot());
// game.state.add('Preloader', Preload);
game.state.add('Menu', Menu);
// game.state.add('Game', Game);
game.state.start('Boot');