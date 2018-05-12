/*
 * Based on:
 * ==========================================
 * VisualTimer.js
 * https://github.com/terebentina/VisualTimer
 * ==========================================
 * Copyright 2014 Dan Caragea.
 *
 * Licensed under the MIT license
 * http://opensource.org/licenses/MIT
 * ==========================================
 *
 * Improvements will be opened in a pull request in the future.
 * */

export default class VisualTimer {

    constructor(opts) {
        this.type = 'down';
        if (opts.type) {
            this.type = opts.type;
        }
        this.totalTime = opts.seconds;
        this.game = opts.game;
        this.onComplete = opts.onComplete;
        var key = 'timer';
        if (opts.key) {
            key = opts.key;
        }
        this.game.add.sprite(opts.x, opts.y, key, 1);
        this.sprite = this.game.add.sprite(opts.x, opts.y, key, 0);
        this.fullWidth = this.sprite.width;
        this.reset();
    }

    reset() {
        if (this.timer) {
            this.timer.stop();
        }
        var self = this;
        this.hasFinished = false;
        this.timer = this.game.time.create(true);
        this.timer.repeat(Phaser.Timer.SECOND, this.totalTime, this.timerTick, this);
        this.timer.onComplete.add(function () {
            self.hasFinished = true;
            if (self.onComplete) {
                self.onComplete();
            }
        });
        this.rect = new Phaser.Rectangle(0, 0, 0, this.sprite.height);
        if (this.type == 'down') {
            this.sprite.crop(null);
        } else {
            this.sprite.crop(this.rect);
        }
    }

    setTime(seconds) {
        this.totalTime = seconds;
        this.reset();
    }

    start() {
        this.reset();
        this.timer.start();
    }

    stop() {
        this.timer.stop();
    }

    pause() {
        this.timer.pause();
    }

    resume() {
        this.timer.resume();
    }

    remainingTime() {
        return this.totalTime - this.timer.seconds;
    }

    timerTick() {
        /*jshint validthis:true */
        var myTime = (this.type == 'down') ? this.remainingTime() : this.timer.seconds;
        this.rect.width = Math.max(0, (myTime / this.totalTime) * this.fullWidth);
        this.sprite.crop(this.rect);
    }
}