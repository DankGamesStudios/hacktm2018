import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

export default class Game extends Phaser.State {

    constructor() {
        super();
        this.rows = [];
        this.padding_x = 20;
        this.padding_y = 20;
        this.tile_size = 60;
        this.row_size = 100;
        this.move_rows = false;
    }

    preload(game) {

    }

    create(game) {
        for (let row = 0; row < 5; row++) {
            let new_row = [];
            for (let col = 0; col < 8; col++) {
                let x = this.padding_x + col * this.row_size;
                let y = this.padding_y + row * this.row_size;
                let tile = this.game.add.sprite(x, y, 'plus');
                tile.anchor.setTo(0.5, 0.5);
                new_row.push(tile);
            }
            this.rows.push(new_row);
        }
        let timeoutID = window.setTimeout(() => {
            console.log('Something happened on the server, let\'s update rows');
            this.move_rows = true;
        }, 3000);
        console.log('Game state');
    };

    addNewRow() {
        let removedRow = this.rows.splice(-1, 1)[0];
        removedRow.map(tile => tile.destroy());
        let newRow = [];
        for (let col = 0; col < 8; col++) {
            let x = this.padding_x + col * this.row_size;
            let y = this.padding_y;
            let tile = this.game.add.sprite(x, y, 'minus');
            tile.anchor.setTo(0.5, 0.5);
            newRow.push(tile);
        }
        this.rows.push(newRow);
    }

    update(game) {
        if (this.move_rows) {
            for (let rIndex = 0; rIndex < this.rows.length; rIndex++) {
                let row = this.rows[rIndex];
                for (let tileIndex = 0; tileIndex < row.length; tileIndex++) {
                    let tile = row[tileIndex];
                    this.game.add.tween(tile).to({y: '+' + this.row_size}, 300, 'Bounce', true);
                }
            }
            this.addNewRow();
            this.move_rows = false;
            console.log('rows moved');
        }
    };
};