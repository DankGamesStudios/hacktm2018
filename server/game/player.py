""" Module for player logic. This could include the AI as well. """
from .exceptions import IllegalMoveException
from .options import GRID_HEIGHT, GRID_WIDTH

MOVE_LIMITS = range(-3, 3)

class Player(object):
    """ Class to model business logic of player.
        It can/will interact with the Grid and other Players."""
    def __init__(self, name, position, player_id=""):
        print("creating player")
        self.health = 100
        self.name = name
        self.position = list(position)
        self.valid_position()
        self.my_id = player_id
    
    def __str__(self):
        return "{name}[{health}] at ({x}, {y})".format(
            name=self.name,
            health=self.health,
            x=self.position[0],
            y=self.position[1]
        )

    def valid_position(self):
        if not self.position_in_grid_range(self.position[0], self.position[1]):
            raise IllegalMoveException("Player position outside grid range")
        return True

    def position_in_grid_range(self, row_coord, col_coord):
        return row_coord <= GRID_HEIGHT or col_coord <= GRID_WIDTH

    def move(self, horizontal_pos, vertical_pos):
        if horizontal_pos in MOVE_LIMITS and vertical_pos in MOVE_LIMITS:
            horizontal_coord = self.position[0] + horizontal_pos
            vertical_coord = self.position[1] + vertical_pos
            if self.position_in_grid_range(horizontal_coord, vertical_coord):
                self.position[0] += horizontal_pos
                self.position[1] += vertical_pos
            else:
                raise IllegalMoveException("Player position outside grid range")
        else:
            raise IllegalMoveException("Player moves not in range {}".format(MOVE_LIMITS))
        return self.position