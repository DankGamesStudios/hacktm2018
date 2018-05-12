""" Module to test the elements in game, and the way they 
    interract with each other """
import game.powerups as powerups
import game.game as game
import game.grid as grid
import game.player as player


def test_square():
    test_obj = powerups.Square()
    assert test_obj.placeholder is not None
    assert test_obj.placeholder.name is not None
    assert test_obj.placeholder in powerups.OPTIONS


def test_game():
    test_obj = game.Game()
    # before starting the game, there's no grid nor players
    assert not hasattr(test_obj, 'grid')
    assert not hasattr(test_obj, 'players')
    test_obj.start()
    # after starting the game, we have grid and players
    assert hasattr(test_obj, 'grid')
    assert hasattr(test_obj, 'players')


def test_grid():
    test_obj = grid.Grid()
    assert len(test_obj.squares) == grid.GRID_HEIGHT
    assert len(test_obj.squares[0]) == grid.GRID_WIDTH


def test_player():
    test_obj = player.Player("testPlayer", (0, 0))
    assert(test_obj.name == "testPlayer")
    assert(test_obj.health == 100)
    assert(test_obj.position == (0, 0))
