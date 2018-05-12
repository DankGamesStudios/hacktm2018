""" Module to implement game specific business logic.
    This means what elements are in the game and how they interact.
    I expect this module to be broken apart in more files,
    as the logic gets refined
"""
import uuid
from . import player, grid, powerups


class Game(object):
    """ Class to model the game business logic.
        It should be able to start/stop, add players, request moves, etc.
    """
    def __init__(self, game_id="{}".format(uuid.uuid4())):
        self.game_id = game_id
        self.players = {}

    def _is_position_busy(self, position):
        for player in self.players.values():
            if position == player.position:
                return True
        return False

    def add_player(self, player_id=uuid.uuid4(), name="Player", position=[0, 0]):
        if not self._is_position_busy(position) or not player_id in self.players.keys():
            self.players[player_id] = player.Player(name=name,
                                                    position=position,
                                                    player_id=player_id)
    
    def start(self, player_no=4):
        self.grid = grid.Grid()
        print("starting game:")
        self.grid.print_grid()
        print("add players")
        for index in range(player_no):
            player_id="{}".format(uuid.uuid4())
            self.add_player(player_id=player_id,
                            name=player_id,
                            position= [2, 2 + 4 * index]) 