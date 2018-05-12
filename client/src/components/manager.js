import io from 'socket.io-client';

export default class GameManager {

    constructor() {
        var s = new WebSocket('ws://10.10.2.16:8000/');
        s.addEventListener('error', function (m) {
            log("error");
        });
        s.addEventListener('open', function (m) {
            console.log("websocket connection open");
        });
        s.addEventListener('message', function (m) {
            console.log(m.data);
        });
        this.availablePlayers = 1;
    }

    getAvailablePlayers() {
        return this.availablePlayers;
    }
}