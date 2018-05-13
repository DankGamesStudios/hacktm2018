""" Module to implement game specific business logic.
    This means what elements are in the game and how they interact.
    I expect this module to be broken apart in more files,
    as the logic gets refined
"""
import uuid
import random
from . import player, grid, powerups, options

SAME_SQUARE_DAMAGE = 20


class Game(object):
    """ Class to model the game business logic.
        It should be able to start/stop, add players, request moves, etc.
    """
    def __init__(self, game_id="{}".format(uuid.uuid4())):
        self.game_id = game_id
        self.players = {}
        self.animations = []

    def _is_position_busy(self, position):
        for player in self.players.values():
            if position == player.position:
                return True
        return False
    
    def _conflics_position(self, position):
        conflicts = []
        for player in self.players.values():
            if position == player.position:
                conflicts.append(player)
        return conflicts

    def add_player(self, player_id=uuid.uuid4(), name="Player", position=[0, 0]):
        if not self._is_position_busy(position) or not player_id in self.players.keys():
            new_player = player.Player(name=name,
                                       position=position,
                                       player_id=player_id)
            self.players[player_id] = new_player
            return new_player
        raise AssertionError("position conflict in add player")

    def start(self):
        """ each story has a beginning."""
        self.grid = grid.Grid()
        print("starting game:")
        self.grid.print_grid()
    
    def stop(self):
        """ each story has an end."""
        print("stopping game")
        self.players = {}
        self.grid = None
        self.animations = []
    
    def serialize(self):
        """ return the data, so it can be displayed in phaser."""
        alive_players = self.get_alive_players()
        data = {
            "state": "running",
            "players": {
                playerx.player_id: {
                    "p_id": playerx.player_id,
                    "x": playerx.position[0],
                    "y": playerx.position[1],
                    "health": playerx.health,
                    "name": playerx.name,
                    "sideEffects": playerx.side_effects,
                } for playerx in self.players.values()
            },
            "nextRow": [
                item.name for item in self.grid.next_row
            ],
            "winner": None,
            "animations": self.animations
        }
        if len(alive_players) == 1:
            data['winner'] = alive_players[0].player_id
            data['state'] = 'won'
        if len(alive_players) == 0:
            data['state'] = 'draw'
        return data

    def serialize_grid(self):
        return [
            [square.name for square in row]
            for row in self.grid.squares
        ]

    def add_default_players(self):
        """ helper method to test stuff on backend.
            we have to separate this from start() because rest api
            needs to provide specific ids and names to players."""
        print("add players")
        for index in range(4):
            player_id="{}".format(uuid.uuid4())
            self.add_player(player_id=player_id,
                            name=player_id,
                            position=[2, 2 + 4 * index])

    def get_alive_players(self):
        """ method to help with deciding if we need another turn."""
        return [
            player for player in self.players.values()
            if player.health > 0
        ]

    def move_player(self, player_id, new_x, new_y):
        """ method to facilitate the moving of players through game."""
        moving_player = self.players.get(player_id, None)
        if not moving_player:
            raise Exception("There's no player with that id!")
        # if new_x and new_y are absolute, not relative to player position,
        # uncomment next lines

        print('mv1', moving_player.position[0],moving_player.position[1], new_x, new_y)
        new_x = new_x - moving_player.position[0]
        new_y = new_y - moving_player.position[1]
        moving_player.move(new_x, new_y)

    def make_a_turn(self):
        """ maybe this is needed?"""
        self.animations = []
        self.grid.row_generate()
        self.resolve_conflicts()
        self.activate_powerup()

    def activate_powerup(self):
        """ iterate through all players and activate the powerup
            they're sitting on. then that square becomes empty."""
        for player in self.players.values():
            x, y = player.position
            placeholder = self.grid.squares[x][y]
            if placeholder.powerup:
                placeholder.powerup.activate(self, player)
                placeholder = grid.EMPTY
            player.turn_effects()

    def resolve_conflicts(self):
        """ go through each player and resolve conflicts"""
        for player in self.players.values():
            conflicts = self._conflics_position(player.position)
            if len(conflicts) > 1:
                # we have a conflict
                luck = [random.randint(0, 10) for player in conflicts]
                winner = luck.index(max(luck))
                conflicts.remove(conflicts[winner])
                self.animations.append({
                    "power": "fight",
                    "positions": [{
                        "pos": player.position,
                        "player_id": player.player_id
                    }],
                })
                self._kick_losers(conflicts)

    def _kick_losers(self, losers):
        """ they should move to a free adjacent cell/square.
            this be one huge function, many apologies."""
        for player in losers:
            player.damage(SAME_SQUARE_DAMAGE)
            x, y = player.position
            # try west
            if (0 <= (x - 1) > options.GRID_WIDTH and
                not self._is_position_busy([x - 1, y])
                ):
                player.position = [x - 1, y]
            # else north-west (lol, like kanye's daughter)
            elif (0 <= (y - 1) > options.GRID_HEIGHT and
                  0 <= (x - 1) > options.GRID_WIDTH and
                  not self._is_position_busy([x -1, y - 1])
                  ): 
                player.position = [x -1, y - 1]
            # else try north
            elif (0 <= (y - 1) > options.GRID_HEIGHT and
                  not self._is_position_busy([x, y - 1])
                  ):
                player.position = [x, y - 1]
            # else try north-east
            elif (0 <= (y - 1) > options.GRID_HEIGHT and
                  0 <= (x + 1) > options.GRID_WIDTH and
                  not self._is_position_busy([x + 1, y - 1])
                  ):
                player.position = [x + 1, y - 1]
            # else try east
            elif (0 <= (x + 1) > options.GRID_WIDTH and
                not self._is_position_busy([x + 1, y])
                ):
                player.position = [x + 1, y]
            # else try south-east
            elif (0 <= (y + 1) > options.GRID_HEIGHT and
                  0 <= (x + 1) > options.GRID_WIDTH and
                  not self._is_position_busy([x + 1, y + 1])
                  ):
                player.position = [x + 1, y + 1]
            # else try south
            elif (0 <= (y + 1) > options.GRID_HEIGHT and
                  not self._is_position_busy([x, y + 1])
                  ):
                player.position = [x, y + 1]
            # else try south-west
            elif (0 <= (y + 1) > options.GRID_HEIGHT and
                  0 <= (x - 1) > options.GRID_WIDTH and
                  not self._is_position_busy([x - 1, y + 1])
                  ):
                player.position = [x - 1, y + 1]
