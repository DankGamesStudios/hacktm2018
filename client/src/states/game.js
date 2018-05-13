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
        this.board_margin_y = 170 + 40;
        this.padding_x = 20;
        this.padding_y = 20;
        this.tile_size = 60;
        this.row_size = 100;
        this.selectedTile = null;
        this.roundText = null;
        this.timerText = null;
        //TODO: use arrow functions, but webpack/babel did not cooperate
        this.selectNextTile = this.selectNextTile.bind(this);
        this.offestGlobalY = 40;

        this.player_start_y = 700;
        this.player_start_x = 250;
        this.player_spacing_x = 400;

        // DATA
        this.rows = []; // Top (0) -> Down (max-1)
        //Each row Left (0) -> Right (max-1)
        this.nr_rows = 5;
        this.nr_columns = 15;
        this.players = {};
        this.timer = null;
        this.lastRenderedRow = 0;
        this.playerScale = 0.6;
    }

    preload(game) {

    }

    // position between 0 and 3
    addPlayer(id, name, xTile, yTile, position, key = 'player') {
        let animationPrefix = position === 0 ? 'male' : position === 1 ? 'female' : 'zombie';
        // TODO: replace with actual player name
        let tile = this.rows[xTile][yTile].tile;
        let sprite = this.game.add.sprite(tile.x, tile.y, key);
        sprite.playerId = id;
        sprite.anchor.setTo(0.5, 0.5);
        sprite.scale.setTo(this.playerScale, this.playerScale);
        sprite.animations.add('jump', [animationPrefix + '_jump'], 1, false);
        sprite.animations.add('walk', [animationPrefix + '_walk1', animationPrefix + '_walk2'], 2, true);
        sprite.animations.add('boom', null, 16, false);
        sprite.animations.play('walk');
        let color = '#9eff63';
        if (this.manager.playerId === id) {
            color = '#00ddcc';
            sprite.scale.setTo(this.playerScale*1.5, this.playerScale*1.5);
        }
        // else {
        //     sprite.alpha = 75;
        // }

        let nameSprite = this.game.add.text(
            this.player_start_x + position * this.player_spacing_x,
            this.player_start_y +10 + this.offestGlobalY,
            name,
            {font: '30px', fill: color, align: 'center'});
        nameSprite.anchor.set(0.5, 0.5);
        let healthSprite = this.game.add.text(
            this.player_start_x + position * this.player_spacing_x,
            this.player_start_y + 80 + this.offestGlobalY,
            '...',
            {font: '60px', fill: color, align: 'center'});
        healthSprite.anchor.set(0.5, 0.5);
        let extraSprite = this.game.add.text(
            this.player_start_x + position * this.player_spacing_x,
            this.player_start_y + 130 + this.offestGlobalY,
            '',
            {font: '60px', fill: color, align: 'center'});
        extraSprite.anchor.set(0.5, 0.5);
        this.players[id] = {
            id,
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
        tile.original_scale = 1;
        tile.power_type = type;
        if (type === Tile.LASER) {
            power = this.game.add.sprite(x, y, 'laser');
        } else if (type === Tile.SHIELD) {
            power = this.game.add.sprite(x, y, 'shield');
        } else if (type === Tile.BOMB) {
            power = this.game.add.sprite(x, y, 'bomb');
        } else if (type === Tile.ANVIL) {
            power = this.game.add.sprite(x, y, 'anvil');
            power.scale.setTo(0.1, 0.1);
            tile.original_scale = 0.1;
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
        this.lastRenderedRow = 5;
    }

    create(game) {
        this.drawBoard();
        let index = 0;
        for (let id in this.manager.players) {
            let player = this.manager.players[id];
            console.log('adding player', player);
            this.addPlayer(player.p_id, player.name, player.x, player.y, index);
            index++;
        }
        this.timer = new VisualTimer({
            game: this.game,
            x: 80,
            y: 50 + this.offestGlobalY,
            seconds: 30,
            onComplete: function () {
                console.log('timer completed')
            }
        });
        this.timerText = this.game.add.text(
            80, 
            10 + this.offestGlobalY,
            'Timer',
            {font: '30px', fill: '#9eff63', align: 'center'});
        this.roundText = this.game.add.text(
            600,
            44 + this.offestGlobalY,
            'Round 0',
            {font: '30px', fill: '#9eff63', align: 'center'});
        console.log('Game state');
    };

    addNewRow(rowData) {
        for (let rIndex = 0; rIndex < this.rows.length; rIndex++) {
            let row = this.rows[rIndex];
            for (let tileIndex = 0; tileIndex < row.length; tileIndex++) {
                let tileData = row[tileIndex];
                this.game.add.tween(tileData.tile).to({y: '+' + this.row_size}, 300, 'Bounce', true);
                if (tileData.power) {
                    this.game.add.tween(tileData.power).to({y: '+' + this.row_size}, 300, 'Bounce', true);
                }
            }
        }
        let removedRow = this.rows.splice(-1, 1)[0];
        removedRow.map(tileData => {
            if (this.selectedTile === tileData.tile) {
                this.selectedTile = null;
            }
            tileData.tile.destroy();
            if (tileData.power) {
                tileData.power.destroy();
            }
        });
        let newRow = [];
        for (let col = 0; col < this.nr_columns; col++) {
            let x = this.padding_x + col * this.row_size + this.board_margin_x;
            let y = this.padding_y + this.board_margin_y;
            newRow.push(this.createTile(x, y, col, this.lastRenderedRow, rowData[col]));
        }
        this.rows.splice(0, 0, newRow);
        // console.log('adding new row', this.rows);
    }

    setDirection(player, destination) {
        var scale = this.playerScale;
        console.log(player);
        if(player.playerId == this.manager.playerId){
            scale = scale * 1.7;
        }
        if (player.x > destination.x) {
            player.scale.x = -scale;
        } else {
            player.scale.x = scale;
        }
        // if (player.y > destination.y) {
        //     player.angle = 30;
        // } else {
        //     player.angle = -30;
        // }
    }

    updatePlayers() {
        for (let playerId in this.manager.players) {
            let playerData = this.manager.players[playerId];
            // console.log('update player', playerData);
            let player = this.players[playerData.p_id];
            if (playerData.health <= 0) {
                if (player.sprite.alive) {
                    player.sprite.kill();
                    player.sprite.destroy();
                }
                continue;
            }
            let target = this.rows[playerData.x][playerData.y];
            player.sprite.bringToTop();
            player.sprite.angle = this.setDirection(player.sprite, target.tile);
            if (target.power) {
                target.power.scale.setTo(3 * target.tile.original_scale, 3 * target.tile.original_scale);
                target.power.angle = 30;
                this.game.add.tween(target.power).to({y: '+30'}, 500, 'Bounce', true);
                this.game.time.events.add(600, () => {
                    target.power.destroy();
                }, this);
            }
            let newLocation = {x: target.tile.x, y: target.tile.y + this.row_size};
            player.sprite.animations.play('jump', 1, false);

            // animate the player move to appear like a jump or flight
            let tween = this.game.add.tween(player.sprite).to({
                x: [newLocation.x, newLocation.x + 50, newLocation.x],
                y: [newLocation.y, newLocation.y - 200, newLocation.y],
            }, 1000, Phaser.Easing.Quadratic.Out, true).interpolation(function (v, k) {
                return Phaser.Math.bezierInterpolation(v, k);
            });
            this.game.time.events.add(1000, walkAgain, this);

            function walkAgain() {
                player.sprite.animations.play('walk', 2, true);
            }
        }
    }

    updateAnimations() {
        console.log(this.manager.animations);
        for (let animationIndex in this.manager.animations) {
            let animation = this.manager.animations[animationIndex];
            if (animation.power === 'laser') {
                // console.log('rendering laser', animation);
                for (let positionIndex in  animation.positions) {
                    let position = animation.positions[positionIndex];
                    let x = position.pos[0], y = position.pos[1];
                    let tile = this.rows[x][y].tile;
                    let sprite = this.game.add.sprite(0, 0, 'laser');
                    sprite.anchor.setTo(0.5, 0.5);
                    sprite.angle = this.setDirection(sprite, tile);
                    this.game.add.tween(sprite).to({x: tile.x, y: tile.y}, 1000, 'Bounce', true);
                    this.game.time.events.add(1500, () => {
                        sprite.destroy();
                    }, this);

                }
            }
        }
    }

    // makePlayersStatic() {
    //     for (let playerId in  this.manager.players.keys()) {
    //         let playerData = this.manager.players[playerId];
    //         let player = this.players[playerData.name];
    //         player.sprite.animations.play('walk', 2, true);
    //     }
    // }

    update(game) {
        if (this.manager.gameState != 'running') {
            this.game.state.start('GameOver');
        }
        let status = this.manager.getStatus();
        // console.log('status', status);
        let prompt = '';
        if (this.manager.you().health < 0) {
            prompt = 'You are dead';
        } else if (status.phase === 'select') {
            prompt = 'Please select action';
        } else if (status.phase === 'waiting') {
            prompt = 'Waiting on other players';
        }
        this.roundText.text = 'Round ' + status.round + ', ' + prompt;
        for (let id in this.manager.players) {
            let player = this.manager.players[id];
            let playerUI = this.players[id];
            let extraText = '';
            if (player.status === 'waiting') {
                extraText = 'Slowpoke!';
            }
            // } else if (status.phase === 'done') {
            //     let newTile = this.rows[player.y][player.x];
            //     this.updatePlayer(playerUI, newTile)
            // }
            this.players[id].extraSprite.text = extraText;
            this.players[id].healthSprite.text = player.health > 0 ? player.health : 'Dead';

        }
        if (this.lastRenderedRow != this.manager.lastRow) {
            console.log('Rendering next state');
            console.log(this.players, this.manager.players);
            this.lastRenderedRow = this.manager.lastRow;
            this.updateAnimations();
            this.addNewRow(this.manager.rows[this.lastRenderedRow]);
            this.updatePlayers();
            this.timer.reset();
            this.timer.start();
            this.selectedTile = null;
        }

        let available = this.manager.getSelectableTiles();
        for (let i = 0; i < this.rows.length; i++) {
            let row = this.rows[i];
            for (let col = 0; col < row.length; col++) {
                row[col].tile.my_x = i;
                row[col].tile.my_y = col;
                if (!this.selectedTile && i >= available.minX && i <= available.maxX && col >= available.minY && col <= available.maxY) {
                    row[col].tile.loadTexture('normal_tile_available');
                    row[col].tile.inputEnabled = true;
                    row[col].tile.input.useHandCursor = true;

                } else if (this.selectedTile == row[col].tile) {
                    row[col].tile.loadTexture('normal_tile_selected');
                    row[col].tile.inputEnabled = false;
                    row[col].tile.input.useHandCursor = false;
                } else {
                    row[col].tile.loadTexture('normal_tile');
                    row[col].tile.inputEnabled = false;
                    row[col].tile.input.useHandCursor = false;
                }
            }
        }
    };
};
