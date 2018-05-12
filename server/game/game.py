""" Module to implement game specific business logic.
    This means what elements are in the game and how they interact.
    I expect this module to be broken apart in more files,
    as the logic gets refined
"""

from . import player, grid, powerups

class Game(object):
    """ Class to model the game business logic.
        It should be able to start/stop, add players, request moves, etc.
    """
    def __init__(self):
        pass # dunno what to do here yet
    
    def start(self):
        self.grid = grid.Grid()
        print("starting game:")
        self.grid.print_grid()
        print("add players")
        self.players = {
            "player one": player.Player("player one", (0, 0))
        }
