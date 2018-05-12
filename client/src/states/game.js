import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

export default class Game extends Phaser.State {

    constructor() {
        super();
        this.rows = []; // Top (0) -> Down (max - 1)
        this.board_margin_x = 70;
        this.board_margin_y = 70;
        this.padding_x = 20;
        this.padding_y = 20;
        this.tile_size = 60;
        this.row_size = 100;
        this.nr_rows = 5;
        this.nr_columns = 12;
        this.move_rows = false;
        this.selectedTile = null;
        //TODO: use arrow functions, but webpack/babel did not cooperate
        this.selectNextTile = this.selectNextTile.bind(this);
    }

    getSelectedVersion(currentVersion) {
        return {
            'plus': 'minus',
            'minus': 'plus'
        }[currentVersion];
    }

    preload(game) {

    }

    selectNextTile(selectedTile) {
        if (this.selectedTile) {
            this.selectedTile.loadTexture(this.getSelectedVersion(this.selectedTile.key));
        }
        console.log('selected tile changed', selectedTile);
        selectedTile.loadTexture(this.getSelectedVersion(selectedTile.key));
        this.selectedTile = selectedTile;
    }

    createTile(x, y, type = 'plus') {
        let tile = this.game.add.sprite(x, y, type);
        tile.anchor.setTo(0.5, 0.5);
        tile.inputEnabled = true;
        tile.input.useHandCursor = true;
        tile.events.onInputDown.add(this.selectNextTile, this);
        return tile;
    }

    create(game) {
        for (let row = 0; row < this.nr_rows; row++) {
            let new_row = [];
            for (let col = 0; col < this.nr_columns; col++) {
                let x = this.padding_x + col * this.row_size + this.board_margin_x;
                let y = this.padding_y + row * this.row_size + this.board_margin_y;
                new_row.push(this.createTile(x, y));
            }
            this.rows.push(new_row);
        }
        this.setNewRowState({});
        console.log('Game state');
    };

    setNewRowState(stateFromServer) {
        console.log('Something happened on the server, let\'s update rows');
        this.move_rows = true;
        window.setTimeout(() => {
            this.setNewRowState({});
        }, 5000);
    }

    addNewRow() {
        let removedRow = this.rows.splice(-1, 1)[0];
        removedRow.map(tile => {
            if (this.selectedTile === tile) {
                this.selectedTile = null;
            }
            tile.destroy();
        });
        let newRow = [];
        for (let col = 0; col < this.nr_columns; col++) {
            let x = this.padding_x + col * this.row_size + this.board_margin_x;
            let y = this.padding_y + this.board_margin_y;
            newRow.push(this.createTile(x, y, 'minus'));
        }
        this.rows.splice(0, 0, newRow);
        console.log('adding new row', this.rows);
    }

    update(game) {
        if (this.move_rows) {
            console.log('moving rows', this.rows);
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