import random

from .name_choices import NAMES, ADJECTIVES


USED_NAMES = []


def get_name():
    name = random.choice(NAMES)
    adjective = random.choice(ADJECTIVES)
    player_name = '{} {}'.format(adjective, name)
    if player_name not in USED_NAMES:
        USED_NAMES.append(player_name)
        return player_name
    else:
        return get_name()

