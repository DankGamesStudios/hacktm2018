import io from 'socket.io-client';

export default class GameManager {

    constructor() {
        this.socket = io('http://10.10.2.16:8000');
        this.socket.on('connect', function () {
            console.log('connection made')
        });
        this.socket.on('connect_failed', function () {
            console.log('connection failed');
        });
        this.socket.on('event', function (data) {
            console.log('event')
        });
        this.socket.on('disconnect', function () {
            console.log('disconnect');
        });

        this.availablePlayers = 1;
    }

    getAvailablePlayers() {
        return this.availablePlayers;
    }
}