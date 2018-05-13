import random

from .name_choices import NAMES, ADJECTIVES


def get_name():
    name = random.choice(NAMES)
    adjective = random.choice(ADJECTIVES)
    nb = random.randint(100, 999)
    return '{} {}-{}'.format(adjective, name, nb)
