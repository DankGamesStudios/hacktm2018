import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

import VisualTimer from '../components/timer';
import {Tile} from '../components/manager';

// Phaser x low->high === left->right
// Phaser y low->high === top->down

export default class Game extends Phaser.State {

    constructor(game, manager) {
        super(game);
        this.manager = manager;

        this.board_margin_x = 100;
        this.board_margin_y = 170;
        this.padding_x = 20;
        this.padding_y = 20;
        this.tile_size = 60;
        this.row_size = 100;
        this.selectedTile = null;
        this.roundText = null;
        //TODO: use arrow functions, but webpack/babel did not cooperate
        this.selectNextTile = this.selectNextTile.bind(this);

        this.player_start_y = 700;
        this.player_start_x = 250;
        this.player_spacing_x = 200;

        // DATA
        this.rows = []; // Top (0) -> Down (max-1)
        //Each row Left (0) -> Right (max-1)
        this.nr_rows = 5;
        this.nr_columns = 12;
        this.players = {};
        this.timer = null;
    }

    preload(game) {

    }

    // position between 0 and 3
    addPlayer(name, xTile, yTile, position, key = 'player') {
        let tile = this.rows[yTile][xTile].tile;
        let sprite = this.game.add.sprite(tile.x, tile.y, key);
        sprite.anchor.setTo(0.5, 0.5);
        sprite.animations.add('run');
        let nameSprite = this.game.add.text(
            this.player_start_x + position * this.player_spacing_x,
            this.player_start_y,
            name,
            {font: '30px', fill: '#9eff63', align: 'center'});
        nameSprite.anchor.set(0.5, 0.5);
        let healthSprite = this.game.add.text(
            this.player_start_x + position * this.player_spacing_x,
            this.player_start_y + 70,
            '9000+',
            {font: '30px', fill: '#9eff63', align: 'center'});
        healthSprite.anchor.set(0.5, 0.5);
        let extraSprite = this.game.add.text(
            this.player_start_x + position * this.player_spacing_x,
            this.player_start_y + 140,
            '',
            {font: '30px', fill: '#9eff63', align: 'center'});
        extraSprite.anchor.set(0.5, 0.5);
        this.players[name] = {
            name,
            nameSprite,
            healthSprite,
            extraSprite,
            sprite,
            xTile,
            yTile,
        };
    }

    selectNextTile(selectedTile) {
        if (this.selectedTile) {
            this.selectedTile.loadTexture('normal_tile');
        }
        // console.log('selected tile changed', selectedTile);
        this.manager.selectTile(selectedTile.my_x, selectedTile.my_y);
        selectedTile.loadTexture('normal_tile_selected');
        this.selectedTile = selectedTile;
    }

    createTile(x, y, logical_x, logical_y, type) {
        // console.log(type, Tile.LASER);
        let tile = this.game.add.sprite(x, y, 'normal_tile');
        let power = null;
        if (type === Tile.LASER) {
            power = this.game.add.sprite(x, y, 'laser');
        } else if (type === Tile.SHIELD) {
            power = this.game.add.sprite(x, y, 'shield');
        }
        if (power) {
            power.anchor.setTo(0.5, 0.5);
        }
        tile.my_x = logical_x;
        tile.my_y = logical_y;

        tile.anchor.setTo(0.5, 0.5);
        tile.inputEnabled = true;
        tile.input.useHandCursor = true;
        tile.events.onInputDown.add(this.selectNextTile, this);
        return {
            tile,
            power,
        };
    }

    drawBoard() {
        this.rows.map(row => {
            row.map(tileData => tileData.tile.destroy());
        });
        this.rows = [];
        for (let row = 0; row < this.nr_rows; row++) {
            let new_row = [];
            let rowData = this.manager.rows[this.manager.lastRow - row];
            // console.log(rowData);
            for (let col = 0; col < this.nr_columns; col++) {
                let x = this.padding_x + col * this.row_size + this.board_margin_x;
                let y = this.padding_y + row * this.row_size + this.board_margin_y;
                new_row.push(this.createTile(x, y, col, row, rowData[col]));
            }
            this.rows.push(new_row);
        }
    }

    create(game) {
        this.drawBoard();
        // this.setNewRowState({});
        for (let i = 0; i < this.manager.players.length; i++) {
            let player = this.manager.players[i];
            this.addPlayer(player.name, player.x, player.y, i);
        }
        this.timer = new VisualTimer({
            game: this.game,
            x: 120,
            y: 30,
            seconds: 10,
            onComplete: function () {
                console.log('timer completed')
            }
        });
        this.roundText = this.game.add.text(
            600,
            100,
            'Round 0',
            {font: '30px', fill: '#9eff63', align: 'center'});
        console.log('Game state');
    };

    // setNewRowState(stateFromServer) {
    //     console.log('Something happened on the server, let\'s update rows');
    //     this.move_rows = true;
    //     window.setTimeout(() => {
    //         this.setNewRowState({});
    //         this.timer.reset();
    //         this.timer.start();
    //     }, 5000);
    // }

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
        // console.log('adding new row', this.rows);
    }

    setDirection(player, destination) {
        if (player.x > destination.x) {
            player.scale.x = 1;
        } else {
            player.scale.x = -1;
        }
        // if (player.y > destination.y) {
        //     player.angle = 30;
        // } else {
        //     player.angle = -30;
        // }
    }

    updatePlayer(player, destination) {
        player.sprite.bringToTop();
        player.sprite.angle = this.setDirection(player.sprite, destination);
        let newLocation = {x: destination.x, y: destination.y + this.row_size};
        player.sprite.animations.play('run', 15, true);
        let animationTime = 1000;
        this.game.add.tween(player.sprite).to(newLocation, animationTime, Phaser.Easing.Bounce.Out, true, 0);
        //TODO find other way to cancel animation
        window.setTimeout(() => {
                player.sprite.animations.stop(true);
            },
            animationTime);
    }

    update(game) {
        let status = this.manager.getStatus();
        // console.log('status', status);
        let prompt = '';
        if (status.phase === 'select') {
            prompt = 'Please select action';
        } else if (status.phase === 'waiting') {
            prompt = 'Waiting on other players';
        }
        this.roundText.text = 'Round ' + status.round + ', ' + prompt;
        for (let i = 0; i < this.manager.players.length; i++) {
            let player = this.manager.players[i]
            let playerUI = this.players[player.name];
            let extraText = '';
            if (player.status === 'waiting') {
                extraText = 'Slowpoke!';
            } else if (status.phase === 'done') {
                let newTile = this.rows[player.y][player.x];
                this.updatePlayer(playerUI, newTile)
            }
            this.players[player.name].extraSprite.text = extraText;
            this.players[player.name].healthSprite.text = player.health;
        }
        let available = this.manager.getSelectableTiles();
        for (let i = 0; i < this.rows.length; i++) {
            let row = this.rows[i];
            for (let col = 0; col < row.length; col++) {
                if (!this.selectedTile && col >= available.minX && col <= available.maxX && i >= available.minY && i <= available.maxY) {
                    row[col].tile.loadTexture('normal_tile_available');
                } else if (this.selectedTile == row[col].tile) {
                    row[col].tile.loadTexture('normal_tile_selected');
                } else {
                    row[col].tile.loadTexture('normal_tile');
                }
            }
        }

        // if (this.move_rows) {
        //     // console.log('moving rows', this.rows);
        //     for (let rIndex = 0; rIndex < this.rows.length; rIndex++) {
        //         let row = this.rows[rIndex];
        //         for (let tileIndex = 0; tileIndex < row.length; tileIndex++) {
        //             let tile = row[tileIndex];
        //             this.game.add.tween(tile).to({y: '+' + this.row_size}, 300, 'Bounce', true);
        //         }
        //     }
        //     this.addNewRow();
        //     this.move_rows = false;
        //     this.updatePlayers();
        //     // console.log('rows moved');
        // }
    };
};
