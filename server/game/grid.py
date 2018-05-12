from .powerups import Square, EMPTY

GRID_HEIGHT = 5
GRID_WIDTH  = 15

class Grid(object):
    def __init__(self):
        """ Constructor for the grid.
            The first lines of squares are the upper ones, the last are 
            the lower ones.
            There is a structure for next row, which is separate from the grid
        """
        print("creating grid")
        self.squares = [
            [Square() for _ in range(GRID_WIDTH)]
            for _ in range(GRID_HEIGHT - 2)
        ] + [
            [Square(EMPTY) for _ in range(GRID_WIDTH)]
            for _ in range(2)
        ]
        self.next_row = [Square() for _ in range(GRID_WIDTH)]

    def row_generate(self):
        """ row_generate adds a row at the start of the grid, like a queue,
            and removes the last row, keeping the same size."""
        print("generating next row ...")
        self.squares.pop(GRID_HEIGHT - 1) # pop the last row
        self.squares.insert(0, self.next_row)
        self.next_row = [Square() for _ in range(GRID_WIDTH)]


    def print_grid(self):
        print("next squares:")
        print("".join([str(elem) for elem in self.next_row]))
        print("playable squares")
        for row in self.squares:
            print("".join([str(elem) for elem in row]))