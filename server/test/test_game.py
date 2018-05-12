""" Module to test the elements in game, and the way they 
    interract with each other """
import server.game.powerups as powerups


def test_square():
    test_obj = powerups.Square()
    assert test_obj.placeholder is not None
    assert test_obj.placeholder.name is not None
    assert test_obj.placeholder in powerups.OPTIONS
