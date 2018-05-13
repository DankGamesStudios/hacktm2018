import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

import VisualTimer from '../components/timer';

// Phaser x low->high === left->right
// Phaser y low->high === top->down

export default class Game extends Phaser.State {

    constructor() {
        super();
        this.board_margin_x = 100;
        this.board_margin_y = 170;
        this.padding_x = 20;
        this.padding_y = 20;
        this.tile_size = 60;
        this.row_size = 100;
        this.move_rows = false;
        this.selectedTile = null;
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
        this.nr_players = 0;
        this.timer = null;
    }

    getSelectedVersion(currentVersion) {
        return {
            'plus': 'minus',
            'minus': 'plus'
        }[currentVersion];
    }

    preload(game) {

    }

    addPlayer(name, xTile, yTile, key = 'player') {
        let tile = this.rows[yTile][xTile];
        let sprite = this.game.add.sprite(tile.x, tile.y, key);
        sprite.anchor.setTo(0.5, 0.5);
        sprite.animations.add('jump', ['male_jump'], 1, false);
        sprite.animations.add('walk', ['male_walk1','male_walk2'], 2, true);
        let nameSprite = this.game.add.text(
            this.player_start_x + this.nr_players * this.player_spacing_x,
            this.player_start_y,
            name,
            {font: '30px', fill: '#9eff63', align: 'center'});
        nameSprite.anchor.set(0.5, 0.5);
        let healthSprite = this.game.add.text(
            this.player_start_x + this.nr_players * this.player_spacing_x,
            this.player_start_y + 70,
            '9000+',
            {font: '30px', fill: '#9eff63', align: 'center'});
        healthSprite.anchor.set(0.5, 0.5);
        this.players[name] = {
            id: this.nr_players,
            name,
            nameSprite,
            healthSprite,
            sprite,
            xTile,
            yTile,
        }
        this.nr_players++;
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
        this.addPlayer('Player1', 4, 3);
        this.addPlayer('Player2', 10, 3);
        this.timer = new VisualTimer({
            game: this.game,
            x: 120,
            y: 30,
            seconds: 10,
            onComplete: function () {
                console.log('timer completed')
            }
        });
        console.log('Game state');
    };

    setNewRowState(stateFromServer) {
        console.log('Something happened on the server, let\'s update rows');
        this.move_rows = true;
        window.setTimeout(() => {
            this.setNewRowState({});
            this.timer.reset();
            this.timer.start();
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
        // console.log('adding new row', this.rows);
    }

    setDirection(player, destination) {
        if (player.x > destination.x) {
            player.scale.x = -1;
        } else {
            player.scale.x = 1;
        }
        // if (player.y > destination.y) {
        //     player.angle = 30;
        // } else {
        //     player.angle = -30;
        // }
    }

    updatePlayers() {
        let player1 = this.players['Player1'];
        player1.sprite.bringToTop();
        if (this.selectedTile) {
            player1.sprite.angle = this.setDirection(player1.sprite, this.selectedTile);
            let newLocation = {x: this.selectedTile.x, y: this.selectedTile.y + this.row_size - 30};
            player1.sprite.animations.play('jump', 1, false);
            
            // animate the player move to appear like a jump or flight
            let tween = this.game.add.tween(player1.sprite).to({
            x: [newLocation.x, newLocation.x + 50, newLocation.x],
            y: [newLocation.y, newLocation.y - 200, newLocation.y],
            }, 1000, Phaser.Easing.Quadratic.Out, true).interpolation(function(v, k){
                return Phaser.Math.bezierInterpolation(v, k);
            });
            
            this.game.time.events.add(1000, walkAgain, this);
            function walkAgain() {player1.sprite.animations.play('walk', 2, true)}
        } else {
            player1.sprite.animations.play('walk', 2, true);
        }
    }

    update(game) {
        if (this.move_rows) {
            // console.log('moving rows', this.rows);
            for (let rIndex = 0; rIndex < this.rows.length; rIndex++) {
                let row = this.rows[rIndex];
                for (let tileIndex = 0; tileIndex < row.length; tileIndex++) {
                    let tile = row[tileIndex];
                    this.game.add.tween(tile).to({y: '+' + this.row_size}, 300, 'Bounce', true);
                }
            }
            this.addNewRow();
            this.move_rows = false;
            this.updatePlayers();
            // console.log('rows moved');
        }
    };
};