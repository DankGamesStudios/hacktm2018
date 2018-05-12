""" Module to test player methods, to make sure movement does not go
    out of bounds, and other business logic."""
import game.player as player
from game.exceptions import IllegalMoveException


def test_move_outside_bounds_by_1():
    p1 = player.Player("Joe", [0, 0], "player1")
    #warmup
    p1.move(0, 0)
    assert p1.position == [0, 0]

    try:
        p1.move(-1, 0)
        assert False
    except IllegalMoveException:
        assert p1.position == [0, 0]

    try:
        p1.move(0, -1)
        assert False
    except IllegalMoveException:
        assert p1.position == [0, 0]


def test_move_outside_bounds_by_2():
    p1 = player.Player("Joe", [0, 0], "player1")
    try:
        p1.move(-2, 0)
        assert False
    except IllegalMoveException:
        assert p1.position == [0, 0]
    
    try:
        p1.move(0, -2)
        assert False
    except IllegalMoveException:
        assert p1.position == [0, 0]


def test_move_outside_bounds_by_2_up():
    p1 = player.Player("Joe", [4, 14], "player1")
    try:
        p1.move(2, 0)
        assert False
    except IllegalMoveException:
        assert p1.position == [4, 14]
    
    try:
        p1.move(0, 2)
        assert False
    except IllegalMoveException:
        assert p1.position == [4, 14]


def test_move_outside_bounds_by_1_up():
    p1 = player.Player("Joe", [4, 14], "player1")
    try:
        p1.move(1, 0)
        assert False
    except IllegalMoveException:
        assert p1.position == [4, 14]
    
    try:
        p1.move(0, 1)
        assert False
    except IllegalMoveException:
        assert p1.position == [4, 14]
