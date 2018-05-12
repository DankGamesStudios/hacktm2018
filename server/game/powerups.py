
from .options import GRID_HEIGHT, GRID_WIDTH


class Powerup(object):
    """ Class to model a Powerup in the Placeholder.
        I actually expect this to be extended by various other powerups."""
    def __init__(self, name):
        self.name = name

    def activate(self, game, on_player, *args, **kwargs):
        pass # to be extended


def player_at_position(game, position):
    result = [
        player for player in game.players.values() 
        if player.position[0] == position[0] and player.position[1] == position[1]
    ]
    return result


class Laser(Powerup):
    def __init__(self):
        super().__init__("Laser")
        self.damage = 35

    def _activate_in_square(self, position, game, except_player):
        affected_players = player_at_position(game, position)
        for player in affected_players:
            # we must take into account that player could have a shield
            # or negative effects, that could alter or negate this damage
            if player != except_player:
                player.health = player.health - self.damage

    def activate(self, game, on_player):
        print("Laser, frate!")
        player_x, player_y = on_player.position
        for idx in range(GRID_WIDTH):
            affected_pos = (player_x, idx)
            self._activate_in_square(affected_pos, game, on_player)

        for idx in range(GRID_HEIGHT):
            affected_pos = (idx, player_y)
            self._activate_in_square(affected_pos, game, on_player)
