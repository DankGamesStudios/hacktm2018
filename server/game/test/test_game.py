""" Module to test the elements in game, and the way they 
    interract with each other """
import game.powerups as powerups
import game.game as game
import game.grid as grid
import game.player as player
import game.options as options


def test_game():
    test_obj = game.Game()
    # before starting the game, there's no grid nor players
    assert not hasattr(test_obj, 'grid')
    assert len(test_obj.players) == 0
    test_obj.start()
    # after starting the game, we have grid and players
    assert hasattr(test_obj, 'grid')
    assert hasattr(test_obj, 'players')


def test_grid():
    test_obj = grid.Grid()
    assert len(test_obj.squares) == options.GRID_HEIGHT
    assert len(test_obj.squares[0]) == options.GRID_WIDTH


def test_player():
    test_obj = player.Player("testPlayer", [0, 0])
    assert(test_obj.name == "testPlayer")
    assert(test_obj.health == 100)
    assert(test_obj.position == [0, 0])


def test_conflicts():
    g1 = game.Game()
    g1.add_default_players()
    g1.start()

    # make two players collide
    iterable = iter(g1.players.values())
    first_player = next(iterable)
    second_player = next(iterable)
    first_player.position = [3, 3]
    second_player.position = [3, 3]

    # resolve conflict
    g1.resolve_conflicts()
    assert first_player.position != second_player.position
    assert first_player.health != second_player.health


