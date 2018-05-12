from game import powerups
from game.game import Game


def test_laser():
    game = Game()
    game.start()
    test_obj = powerups.Laser()
    test_obj.activate(game, game.players['player 1'])
    player2 = game.players['player 2']
    assert player2.health == 100 - test_obj.damage
