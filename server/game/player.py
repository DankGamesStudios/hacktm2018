""" Module for player logic. This could include the AI as well. """


class Player(object):
    """ Class to model business logic of player.
        It can/will interact with the Grid and other Players."""
    def __init__(self, name, position):
        print("creating player")
        self.health = 100
        self.name = name
        self.position = position
    
    def __str__(self):
        return "{name}[{health}] at ({x}, {y})".format(
            name=self.name,
            health=self.health,
            x=self.position[0],
            y=self.position[0]
        )
