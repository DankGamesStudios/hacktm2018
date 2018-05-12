
import random

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