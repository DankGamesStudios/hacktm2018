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
        self.player_id = player_id
        self.position = list(position)
        # add all side effects here, like freezing, invisibility, shields, etc.
        # with the remaining number of turns to be active
        # 0 means effect is inactive
        self.side_effects = {
            "shield": 0
        }
        self.valid_position()
    
    def __str__(self):
        return "{name}[{health}] at ({x}, {y})".format(
            name=self.name,
            health=self.health,
            x=self.position[0],
            y=self.position[1]
        )

    def valid_position(self):
        if not self.position_in_grid_range(self.position[0], self.position[1]):
            raise IllegalMoveException(
                "Player position outside grid range, {}".format(self.position))
        return True

    def position_in_grid_range(self, row_coord, col_coord):
        return 0 <= row_coord < GRID_HEIGHT and 0 <= col_coord < GRID_WIDTH

    def move(self, horizontal_pos, vertical_pos):
        """ change player position by a horizontal and vertical delta."""
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

    def damage(self, dmg_value):
        """ damage is applied if the player has side_effects that allow it.
            i.e. a shield negates damage, a poison like effect
            can enhance damage"""
        if self.can_take_damage():
            # here we'll add if it's affected by negative buffs
            self.health -= dmg_value

    def can_take_damage(self):
        """ determines if damage can be applied to player
            is a separate function because we anticipate a growth in logic here
            """
        result = True
        if self.side_effects["shield"] > 0:
            result = False
        return result

    def turn_effects(self):
        """ turn effects means that the remaining turns for
            various effects decreases."""
        if self.side_effects["shield"] > 0:
            self.side_effects["shield"] -= 1
