import * as Phaser from "phaser-ce";

export default class AnimationManager {

    constructor(game) {
        this.game = game;
    }


    static animationAngle(sprite, originX, originY, destX, destY) {
        if (originX === destX) {
            if (originY === destY) {
                sprite.angle = 0;
            } else if (originY > destY) {
                sprite.angle = 0;
            } else {
                sprite.angle = 180;
            }
        } else if (originX > destX) {
            if (originY === destY) {
                sprite.angle = -90;
            } else if (originY > destY) {
                sprite.angle = -45;
            } else {
                sprite.angle = -135;
            }
        } else {
            if (originY === destY) {
                sprite.angle = 90;
            } else if (originY > destY) {
                sprite.angle = 45;
            } else {
                sprite.angle = 135;
            }
        }
    }

    renderLaser(originX, originY, destX, destY) {
        let sprite = this.game.add.sprite(originX, originY, 'laser');
        sprite.anchor.setTo(0.5, 0.5);
        AnimationManager.animationAngle(sprite, originX, originY, destX, destY);
        this.game.add.tween(sprite).to({x: destX, y: destY}, 2000, 'Bounce', true);
        this.game.time.events.add(2000, () => {
            sprite.tint = 0xee1111;
            sprite.scale.setTo(1.3, 1.3);
        }, this);
        this.game.time.events.add(3500, () => {
            sprite.destroy();
        }, this);
    }

    renderBomb(destX, destY) {
        let sprite = this.game.add.sprite(destX, destY - 700, 'bomb');
        sprite.anchor.setTo(0.5, 0.5);
        this.game.add.tween(sprite).to({y: destY}, 2400, Phaser.Easing.Bounce.Out, true);
        this.game.add.tween(sprite).to({angle: 360}, 2400, Phaser.Easing.Cubic.In, true);
        this.game.time.events.add(2200, () => {
            sprite.tint = 0xeea38e;
            sprite.scale.setTo(1.3, 1.3);
        }, this);
        this.game.time.events.add(2300, () => {
            sprite.tint = 0xee0d0b;
            sprite.scale.setTo(1.7, 1.7);
        }, this);
        this.game.time.events.add(2500, () => {
            sprite.destroy();
        }, this);
    }

    renderShield(destX, destY) {
        let sprite = this.game.add.sprite(destX, destY, 'shield');
        sprite.anchor.setTo(0.5, 0.5);
        sprite.tint = 0x000000;
        this.game.add.tween(sprite).to({angle: 360, tint: 0x00aa00}, 2400, Phaser.Easing.Cubic.In, true);
        this.game.add.tween(sprite.scale).to({x: 2, y: 2}, 2400, Phaser.Easing.Cubic.In, true);
        this.game.time.events.add(2500, () => {
            sprite.destroy();
        }, this);
    }

    renderHammer(destX, destY) {
        let sprite = this.game.add.sprite(destX, destY - 700, 'anvil');
        sprite.anchor.setTo(0.5, 0.5);
        this.game.add.tween(sprite).to({y: destY}, 2000, Phaser.Easing.Exponential.In, true);
        this.game.add.tween(sprite.scale).to({x: 0.3, y: 0.3}, 2000, Phaser.Easing.Exponential.In, true);
        this.game.time.events.add(2400, () => {
            sprite.destroy();
        }, this);
    }
}