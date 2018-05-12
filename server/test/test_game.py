""" Module to test the elements in game, and the way they 
    interract with each other """
import server.game.game as game


def test_square():
    test_obj = game.Square()
    assert test_obj.placeholder is not None
    assert test_obj.placeholder.name is not None
    assert test_obj.placeholder in game.OPTIONS
