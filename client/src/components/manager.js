const CREATE_PLAYER_ID = 'CREATE_PLAYER_ID';
const Action = {
    CREATE_PLAYER_ID,
};
const NONE = 'NONE';
const LASER = 'LASER';
const SHIELD = 'SHIELD';
export const Tile = {
    NONE,
    LASER,
    SHIELD,
};

export default class GameManager {


    constructor() {
        this.socket = this.createSocket();
        this.availablePlayers = 0;
        this.players = [{
            name: 'You',
            x: 4,
            y: 3,
            health: 100,
        }, {
            name: 'thelegend27',
            status: 'waiting',
            x: 10,
            y: 2,
            health: 90,
        }];
        this.myIndex = 0;
        this.round = 0;
        this.phase = 'select';
        this.lastRow = 5;
        this.rows = {
            5: [Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE],
            4: [Tile.NONE, Tile.SHIELD, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE],
            3: [Tile.LASER, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE],
            2: [Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE],
            1: [Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE],
        };
    }

    getSelectableTiles() {
        let player = this.players[this.myIndex];
        return {
            minX: player.x - 2,
            maxX: player.x + 2,
            minY: player.y - 2,
            maxY: player.y + 2,
        };
    }

    createSocket() {
        let s = new WebSocket('ws://10.10.2.16:8000/');
        s.addEventListener('error', function (m) {
            console.log("error");
        });
        s.addEventListener('open', function (m) {
            console.log("websocket connection open");
            s.send(JSON.stringify({
                action: Action.CREATE_PLAYER_ID
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

    getStatus() {
        let status = {
            round: this.round,
            phase: this.phase,
        };
        return status;
    }
}
