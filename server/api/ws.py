import uuid
from gevent.lock import RLock
import json

from geventwebsocket import WebSocketServer, WebSocketApplication, Resource
from collections import OrderedDict

from .pubsub import Publisher, Subscriber


PLAYER_COUNT = 2
bus = Publisher()


def uid():
    return str(uuid.uuid4())


class Player:
    def __init__(self, p_id, name, game_player=None, state=None):
        self.p_id = p_id
        self.name = name
        self.game_player = game_player
        self.state = state
        self.inbox = Subscriber(p_id)
        self.game_id = None

    def start_game(self, game_id):
        self.game_id = game_id

    @classmethod
    def new(cls, name, **kwa):
        p_id = uid()
        return cls(p_id, name, state='lobby', **kwa)


class Game:
    def __init__(self, game_id):
        self.game_id = game_id
        self.players = {}

    def add_player(self, player):
        self.players[player.p_id] = player


class GameServer:
    def __init__(self):
        self.games = {}

    def new_game(self, players):
        g_id = uid()
        game = Game(g_id)
        self.games[g_id] = game
        for player in players:
            game.add_player(player)
            player.start_game(g_id)
            print("bus.send", player.p_id, {'action': 'START_GAME', 'g_id': game.game_id})
            bus.send(player.p_id, {'action': 'START_GAME', 'g_id': game.game_id})
        return game

class Lobby:
    def __init__(self):
        self.players = []
        self.lock = RLock()
        
    def add_player(self, player):
        with self.lock:
            self.players.append(player)
            print("lobby", len(self.players))
            
            if len(self.players) >= PLAYER_COUNT:
                g_players = self.players[0:PLAYER_COUNT]
                self.players = self.players[PLAYER_COUNT:]
                return gs.new_game(g_players)


gs = GameServer()
lobby = Lobby()


class Application(WebSocketApplication):
    def __init__(self, *a, **kwa):
        super().__init__(*a, **kwa)
        self.player = None

    def on_KEEP_ALIVE(self, message):
        pass
        
    def on_CREATE_PLAYER_ID(self, message):
        name = message.get('name', 'nameless')
        self.player = Player.new(name=name)
        self.p_id = self.player.p_id
        game = lobby.add_player(self.player)
        msg = {"status": "ok", "p_id":self.player.p_id, "q_id": len(lobby.players)}
        return msg
            
        
    def on_open(self):
        print("connected")
        
        # self.player = Player.new()
        # lobby.add_player(self.player)

    def on_message(self, message):
        if message is None:
            print("got None!")
            return
        message = json.loads(message);
        action = message['action']
        self.p_id = message.get('p_id')
        callback = getattr(self, f"on_{action}")
        if action == 'KEEP_ALIVE':
            return
        print(message)
        resp = callback(message)
        if resp is not None:
            print("send:", resp)
            self.ws.send(json.dumps(resp))

    def on_close(self, reason):
        print(reason)

    def handle_zmq(self, message):
        self.ws.send(json.dumps(message))
    
    def handle(self):
        # override geventwebsocket's handle so we plug in zmq as well
        self.protocol.on_open()

        while True:
            if self.player:
                zmq_message = self.player.inbox.recv()
                while zmq_message:
                    self.handle_zmq(zmq_message)
                    zmq_message = self.player.inbox.recv()

            try:
                message = self.ws.receive()
            except Exception as excp:
                print(excp)
                self.protocol.on_close()
                break

            self.protocol.on_message(message)

def main():
    WebSocketServer(
        ('', 8000),
        Resource(OrderedDict([
            ('/.*', Application)
        ])),
        debug=True,
    ).serve_forever()


if __name__ == '__main__':
    main()
