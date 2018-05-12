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
        this.playerId = null;
        this.gameId = null;
        this.players = [];
        // this.players = [{
        //     name: 'You',
        //     x: 4,
        //     y: 3,
        //     health: 100,
        // }, {
        //     name: 'thelegend27',
        //     status: 'waiting',
        //     x: 10,
        //     y: 2,
        //     health: 90,
        // }];
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

    selectTile(x, y) {
        console.log("move to", x, y);
        this.sendMessage({action: 'MOVE', x: x, y:y});
    }

    handle_message(message){
        var action = message.action;
        // console.log("msg", message, action);
        switch(action){
        case "START_GAME":
            console.log('starting', message);
            this.myIndex = message.p_index;
            this.playerId = message.p_id;
            this.gameId = message.g_id;
            this.players = message.players;
            this.on_ready();
            break;
        case "WAITING":
            this.availablePlayers = message.q_id;
            break;
        default:
            console.log("unknow msg", message);
        }
    }

    sendMessage(msg) {
        // let player = this.players[this.myIndex];
        msg.p_id = this.playerId;
        msg.g_id = this.gameId;
        this.s.send(JSON.stringify(msg));
    }

    createSocket() {
        // let s = new WebSocket('ws://10.10.2.16:8000/');
        let s = new WebSocket('ws://localhost:8000/');
        this.s = s;
        s.addEventListener('error', function (m) {
            console.log("error");
        });
        s.addEventListener('open', function (m) {
            console.log("websocket connection open");
            s.send(JSON.stringify({
                action: Action.CREATE_PLAYER_ID
            }));
        });
        s.addEventListener('message', (m) => {
            // console.log(m.data);
            this.handle_message(JSON.parse(m.data));
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
