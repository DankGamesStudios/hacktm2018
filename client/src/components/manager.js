import io from 'socket.io-client';

export default class GameManager {

    constructor() {
        var s = new WebSocket('ws://10.10.2.16:8000/');
        s.addEventListener('error', function (m) {
            log("error");
        });
        s.addEventListener('open', function (m) {
            console.log("websocket connection open");
            s.send(JSON.stringify({
                action: "CREATE_PLAYER_ID"
            }));
        });
        s.addEventListener('message', function (m) {
            console.log(m.data);
        });
        this.availablePlayers = 1;
        this.keepalive = () => {
            s.send(JSON.stringify({
                action: "KEEP_ALIVE"
            }));
            window.setTimeout(this.keepalive, 500);
        };
        window.setTimeout(this.keepalive, 500);
    }

    getAvailablePlayers() {
        return this.availablePlayers;
    }
}
