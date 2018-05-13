const CREATE_PLAYER_ID = 'CREATE_PLAYER_ID';
const Action = {
    CREATE_PLAYER_ID,
};
const NONE = 'empty';
const LASER = 'laser';
const SHIELD = 'shield';
const BOMB = 'bomb';
const ANVIL = 'anvil';

export const Tile = {
    NONE,
    LASER,
    SHIELD,
    BOMB,
    ANVIL
};

export default class GameManager {


    constructor() {
        this.socket = this.createSocket();
        this.availablePlayers = 0;
        this.playerId = null;
        this.gameId = null;
        this.players = {};
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
        this.started = false;
        this.rows = {
            5: [Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE],
            4: [Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE],
            3: [Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE],
            2: [Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE],
            1: [Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE, Tile.NONE],
        };
        this.gameState = 'running';
        this.winner = null;
    }


    you() {
        return this.players[this.playerId];
    }

    getSelectableTiles() {
        let player = this.players[this.playerId];
        if (player.health < 0) {
            return {
                minX: -1,
                maxX: -1,
                minY: -1,
                maxY: -1,
            };
        }
        return {
            minX: player.x - 2,
            maxX: player.x + 2,
            minY: player.y - 2,
            maxY: player.y + 2,
        };
    }

    selectTile(x, y) {
        console.log("move to", x, y);
        this.sendMessage({action: 'MOVE', x: x, y: y});
    }

    handle_message(message) {
        var action = message.action;
        // console.log("msg", message, action);
        switch (action) {
            case "START_GAME":
                console.log('starting', message);
                this.myIndex = message.p_index;
                this.playerId = message.p_id;
                this.gameId = message.g_id;
                this.players = {};
                for (let i = 0; i < message.grid.length; i++) {
                    this.rows[5 - i] = message.grid[i];
                }
                break;
            case "WAITING":
                this.availablePlayers = message.q_id;
                break;
            case "UPDATE":
                console.log('UPDATE', message);

                this.lastRow++;
                this.rows[this.lastRow] = message.nextRow;
                this.players = message.players;
                this.gameState = message.state;
                this.winner = message.winner;
                if (!this.started) {
                    this.on_ready();
                    this.started = true;
                }
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
            round: this.lastRow - 4,
            phase: this.phase,
        };
        return status;
    }
}
