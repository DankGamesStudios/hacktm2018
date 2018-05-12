""" Module to implement game specific business logic.
    This means what elements are in the game and how they interact.
    I expect this module to be broken apart in more files,
    as the logic gets refined
"""
import random

GRID_HEIGHT = 5
GRID_WIDTH  = 15

class Placeholder(object):
    """ Class to model a Square-like thing on the grid.
        It will be extended in the Powerups."""
    def __init__(self, name="empty"):
        self.name = name

EMPTY = Placeholder()

OPTIONS = [
    Placeholder('flash'),
    Placeholder('boom'),
    Placeholder('glasses'),
    Placeholder('sound'),
    Placeholder('radioactive'),
    Placeholder('jet-fighter'),
    Placeholder('health'),
    Placeholder('foo'),
    EMPTY,
    EMPTY,
]
OPTION_SIZE = len(OPTIONS) - 1


class Player(object):
    """ Class to model business logic of player.
        It can/will interact with the Grid and other Players."""
    def __init__(self, name, position):
        print("creating player")
        self.health = 100
        self.name = name
        self.position = position


def print_row(row):
    """ helper function to print a row, to figure out in command line
        if the algorithms are maybe working."""
    line = u""
    for square in row:
        line += str(square)
    print(line)


class Grid(object):
    def __init__(self):
        """ Constructor for the grid.
            The first lines of squares are the upper ones, the last are 
            the lower ones.
            There is a structure for next row, which is separate from the grid
        """
        print("creating grid")
        self.squares = [
            [Square() for _ in range(GRID_WIDTH)]
            for _ in range(GRID_HEIGHT - 2)
        ] + [
            [Square(EMPTY) for _ in range(GRID_WIDTH)]
            for _ in range(2)
        ]
        self.next_row = [Square() for _ in range(GRID_WIDTH)]

    def row_generate(self):
        """ row_generate adds a row at the start of the grid, like a queue,
            and removes the last row, keeping the same size."""
        print("generating next row ...")
        self.squares.pop(GRID_HEIGHT - 1) # pop the last row
        self.squares.insert(0, self.next_row)
        self.next_row = [Square() for _ in range(GRID_WIDTH)]


    def print_grid(self):
        print("next squares:")
        print_row(self.next_row)
        print("playable squares")
        for row in self.squares:
            print_row(row)


class Square(object):
    """ Class to model a square in the Grid.
        This and Placeholder could be superfluous.""" 
    def __init__(self, placeholder=None):
        if placeholder is None:
            print("creating random square")
            option = random.randint(0, OPTION_SIZE)
            placeholder = OPTIONS[option]
        self.placeholder = placeholder

    def __str__(self):
        return u"[" + self.placeholder.name + u"]"


class Powerup(Placeholder):
    """ Class to model a Powerup in the Square.
        I actually expect this to be extended by various other powerups."""
    def __init__(self, name):
        super().__init__(name)
