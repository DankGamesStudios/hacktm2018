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
import Game from './states/game';
import GameManager from './components/manager';


let manager = new GameManager();
var game = new Phaser.Game(1300, 900, Phaser.AUTO);
game.state.add('Boot', Boot);
// game.state.add('Preloader', Preload);
game.state.add('Menu', new Menu(game, manager));
game.state.add('Game', new Game(game, manager));
game.state.start('Boot');