import random

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
        positions = {}
        for player in affected_players:
            # we must take into account that player could have a shield
            # or negative effects, that could alter or negate this damage
            if player != except_player:
                player.damage(self.damage)
                positions.update({
                    "pos": player.position,
                    "player_id": player.player_id
                })
        return positions

    def activate(self, game, on_player):
        print("Laser, frate!")
        player_x, player_y = on_player.position
        positions = []
        for idx in range(GRID_WIDTH):
            affected_pos = (player_x, idx)
            affected = self._activate_in_square(affected_pos, game, on_player)
            if affected:
                positions.append(affected)
        for idx in range(GRID_HEIGHT):
            affected_pos = (idx, player_y)
            affected = self._activate_in_square(affected_pos, game, on_player)
            if affected:
                positions.append(affected)
        game.animations.append({
            "power": "laser",
            "positions": positions,
            "origin": [player_x, player_y],
        })


class Shield(Powerup):
    def __init__(self):
        super().__init__("Shield")
        self.turns = 3

    def activate(self, game, on_player):
        print("activate shield")
        on_player.side_effects["shield"] = self.turns
        game.animations.append({
            "power": "shield",
            "positions": [{
                "pos": on_player.position,
                "player_id": on_player.player_id
            }],
        })


class Bomb(Powerup):
    def __init__(self):
        super().__init__("Bomb")
        self.XL_damage = 25
        self.M_damage = 15
        self.S_damage = 5

    def _activate_in_square(self, position, game, except_player, damage):
        affected_players = player_at_position(game, position)
        positions = {}
        for player in affected_players:
            # we must take into account that player could have a shield
            # or negative effects, that could alter or negate this damage
            if player != except_player:
                player.damage(damage)
                positions.update({
                    "pos": player.position,
                    "player_id": player.player_id
                })
        return positions

    def activate(self, game, on_player):

        def get_neighbours(position, distance_to_neighbour):
            x = position[0]
            y = position[1]
            return (
                [(x - distance_to_neighbour, ny) for ny in range(y - distance_to_neighbour, y + distance_to_neighbour, 1)
                 if 0 <= x - distance_to_neighbour < GRID_WIDTH and 0 <= ny < GRID_HEIGHT] +
                [(nx, y + distance_to_neighbour) for nx in range(x - distance_to_neighbour, x + distance_to_neighbour, 1)
                 if 0 <= nx < GRID_WIDTH and 0 <= y + distance_to_neighbour < GRID_HEIGHT] +
                [(x + distance_to_neighbour, ny) for ny in range(y + distance_to_neighbour, y - distance_to_neighbour, -1)
                 if 0 <= x + distance_to_neighbour < GRID_WIDTH and 0 <= ny < GRID_HEIGHT] +
                [(nx, y - distance_to_neighbour) for nx in range(x + distance_to_neighbour, x - distance_to_neighbour, -1)
                 if 0 <= nx < GRID_WIDTH and 0 <= y - distance_to_neighbour < GRID_HEIGHT]
            )
        XL_damage_pos = get_neighbours(on_player.position, 1)
        M_damage_pos = get_neighbours(on_player.position, 2)
        S_damage_pos = get_neighbours(on_player.position, 3)

        positions = []
        for position in XL_damage_pos:
            affected = self._activate_in_square(position, game, on_player, self.XL_damage)
            if affected:
                positions.append(affected)
        for position in M_damage_pos:
            affected = self._activate_in_square(position, game, on_player, self.M_damage)
            if affected:
                positions.append(affected)
        for position in S_damage_pos:
            affected = self._activate_in_square(position, game, on_player, self.S_damage)
            if affected:
                positions.append(affected)

        game.animations.append({
            "power": "bomb",
            "positions": positions,
            "origin": on_player.position,
        })

class Hammer(Powerup):
    def __init__(self):
        super().__init__("Hammer")
        self.damage = 25

    def activate(self, game, on_player):
        print("STOP! Hammer time!")
        possible_victims = [player_id for player_id in game.players.keys() if player_id != on_player.player_id]
        random_victim = random.choice(possible_victims)
        game.players[random_victim].damage(self.damage)

        game.animations.append({
            "power": "hammer",
            "positions": [{
                "pos": game.players[random_victim].position,
                "player_id": game.players[random_victim].player_id
            }],
            "origin": on_player.position,
        })
