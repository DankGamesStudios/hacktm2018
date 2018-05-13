from game import powerups
from game.game import Game


def create_game():
    # preconditions
    game = Game()
    game.start()
    # default players are in a row
    game.add_default_players()
    return game


def test_laser():
    game = create_game()
    test_obj = powerups.Laser()
    iterable = iter(game.players)
    # first player uses laser
    test_obj.activate(game, game.players[next(iterable)])
    # meaning second player suffers damage
    player2 = game.players[next(iterable)]
    assert player2.health == 100 - test_obj.damage


def test_hammer():
    game = create_game()
    test_obj = powerups.Hammer()
    iterable = iter(game.players)
    first_player = game.players[next(iterable)]
    test_obj.activate(game, first_player)
    health_sum = 0
    for player in game.players.values():
        print(player.health)
        health_sum += player.health
    assert health_sum < 400
    assert health_sum == 375
    assert first_player.health == 100

def test_bomb():
    game = create_game()
    test_obj = powerups.Bomb()
    iterable = iter(game.players)
    first_player = game.players[next(iterable)]
    second_player = game.players[next(iterable)]
    third_player = game.players[next(iterable)]
    fourth_player = game.players[next(iterable)]
    first_player.position = [1, 1]
    second_player.position = [0, 1]
    third_player.position = [0, 3]
    fourth_player.position = [0, 4]
    test_obj.activate(game, first_player)
    for player in game.players.values():
        print(player.health)
    assert first_player.health == 100
    assert second_player.health == 75
    assert third_player.health == 85
    assert fourth_player.health == 95