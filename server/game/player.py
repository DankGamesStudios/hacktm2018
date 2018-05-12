""" Module for player logic. This could include the AI as well. """
from exceptions import IllegalMoveException
import grid

MOVE_LIMITS = range(-2, 2)

class Player(object):
    """ Class to model business logic of player.
        It can/will interact with the Grid and other Players."""
    def __init__(self, name, position):
        print("creating player")
        self.health = 100
        self.name = name
        self.position = list(position)
        self.check_initial_position()
    
    def __str__(self):
        return "{name}[{health}] at ({x}, {y})".format(
            name=self.name,
            health=self.health,
            x=self.position[0],
            y=self.position[1]
        )

    def check_initial_position(self):
        if self.position[0] > grid.GRID_HEIGHT or self.position[1] > grid.GRID_WIDTH:
            raise IllegalMoveException("Player position outside grid range")

    def move(self, horizontal_pos, vertical_pos):
        if horizontal_pos in MOVE_LIMITS and vertical_pos in MOVE_LIMITS:
            if self.position[0] < grid.GRID_HEIGHT and self.position[1] < grid.GRID_WIDTH:
                self.position[0] += horizontal_pos
                self.position[1] += vertical_pos
            else:
                raise IllegalMoveException("Player position outside grid range")
        else:
            raise IllegalMoveException("Player moves not in range {}".format(MOVE_LIMITS))
        return self.position