from game import powerups
from game.game import Game


def test_laser():
    # preconditions
    game = Game()
    game.start()
    # default players are in a row
    game.add_default_players()
    test_obj = powerups.Laser()
    iterable = iter(game.players)
    # first player uses laser
    test_obj.activate(game, game.players[next(iterable)])
    # meaning second player suffers damage
    player2 = game.players[next(iterable)]
    assert player2.health == 100 - test_obj.damage
