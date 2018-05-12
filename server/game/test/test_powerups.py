from game import powerups
from game.game import Game


def test_laser():
    # preconditions
    game = Game()
    game.start()
    test_obj = powerups.Laser()
    iterable = iter(game.players)
    test_obj.activate(game, game.players[next(iterable)])
    player2 = game.players[next(iterable)]
    assert player2.health == 100 - test_obj.damage
