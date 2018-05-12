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
                            position=[2, 2 + 4 * index])

    def activate_powerup(self):
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
                winner = max(luck)
                losers = luck.remove(winner)
                self.kick_losers(losers)

    def kick_losers(self, losers):
        """ they should move to a free adjacent cell/square.
            this be one huge function, many apologies."""
        for player in losers:
            player.damage(SAME_SQUARE_DAMAGE)
            x, y = player.position
            # try west
            if (0 >= (x - 1) > options.GRID_WIDTH and
                not self._is_position_busy([x - 1, y])
                ):
                player.position = [x - 1, y]
            # else north-west (lol, like kanye's daughter)
            elif (0 >= (y - 1) > options.GRID_HEIGHT and
                  0 >= (x - 1) > options.GRID_WIDTH and
                  not self._is_position_busy([x -1, y - 1])
                  ): 
                player.position = [x -1, y - 1]
            # else try north
            elif (0 >= (y - 1) > options.GRID_HEIGHT and
                  not self._is_position_busy([x, y - 1])
                  ):
                player.position = [x, y - 1]
            # else try north-east
            elif (0 >= (y - 1) > options.GRID_HEIGHT and
                  0 >= (x + 1) > options.GRID_WIDTH and
                  not self._is_position_busy([x + 1, y - 1])
                  ):
                player.position = [x + 1, y - 1]
            # else try east
            elif (0 >= (x + 1) > options.GRID_WIDTH and
                not self._is_position_busy([x + 1, y])
                ):
                player.position = [x + 1, y]
            # else try south-east
            elif (0 >= (y + 1) > options.GRID_HEIGHT and
                  0 >= (x + 1) > options.GRID_WIDTH and
                  not self._is_position_busy([x + 1, y + 1])
                  ):
                player.position = [x + 1, y + 1]
            # else try south
            elif (0 >= (y + 1) > options.GRID_HEIGHT and
                  not self._is_position_busy([x, y + 1])
                  ):
                player.position = [x, y + 1]
            # else try south-west
            elif (0 >= (y + 1) > options.GRID_HEIGHT and
                  0 >= (x - 1) > options.GRID_WIDTH and
                  not self._is_position_busy([x - 1, y + 1])
                  ):
                player.position = [x - 1, y + 1]
            # else is west
            else:
                player.position = [x - 1, y]
