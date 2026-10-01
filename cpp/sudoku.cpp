#include <iostream>
#include <algorithm>
#include <random>
#include <chrono>
#include <string>

using namespace std;

#define N 9

bool isSafe(int grid[N][N], int row, int col, int num)
{
    int startRow = row - row % 3;
    int startCol = col - col % 3;

    for (int i = 0; i < N; i++)
    {
        if (grid[row][i] == num || grid[i][col] == num)
            return false;
        if (grid[startRow + i / 3][startCol + i % 3] == num)
            return false;
    }
    return true;
}

// Find next empty cell starting from top-left
bool findEmptyCell(int grid[N][N], int &row, int &col)
{
    for (row = 0; row < N; row++)
    {
        for (col = 0; col < N; col++)
        {
            if (grid[row][col] == 0)
                return true;
        }
    }
    return false;
}

// Counts total solutions to ensure generated puzzle uniqueness
int countSolutions(int grid[N][N], int &count)
{
    int row, col;
    if (!findEmptyCell(grid, row, col))
    {
        return ++count;
    }

    for (int num = 1; num <= 9 && count < 2; num++)
    {
        if (isSafe(grid, row, col, num))
        {
            grid[row][col] = num;
            countSolutions(grid, count);
            grid[row][col] = 0;
        }
    }
    return count;
}

bool solveSudoku(int grid[N][N])
{
    int row, col;
    if (!findEmptyCell(grid, row, col))
        return true;

    for (int num = 1; num <= 9; num++)
    {
        if (isSafe(grid, row, col, num))
        {
            grid[row][col] = num;
            if (solveSudoku(grid))
                return true;
            grid[row][col] = 0;
        }
    }
    return false;
}

bool fillGrid(int grid[N][N], mt19937 &rng)
{
    int row, col;
    if (!findEmptyCell(grid, row, col))
        return true;

    int numbers[9] = {1, 2, 3, 4, 5, 6, 7, 8, 9};
    shuffle(numbers, numbers + 9, rng);

    for (int num : numbers)
    {
        if (isSafe(grid, row, col, num))
        {
            grid[row][col] = num;
            if (fillGrid(grid, rng))
                return true;
            grid[row][col] = 0;
        }
    }
    return false;
}

void generatePuzzle(int grid[N][N], mt19937 &rng, int cellsToRemove = 45)
{
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            grid[i][j] = 0;

    fillGrid(grid, rng);

    // Create array of positions to shuffle
    int positions[81];
    for (int i = 0; i < 81; i++)
        positions[i] = i;
    shuffle(positions, positions + 81, rng);

    int removed = 0;
    for (int i = 0; i < 81 && removed < cellsToRemove; i++)
    {
        int r = positions[i] / 9;
        int c = positions[i] % 9;

        int temp = grid[r][c];
        grid[r][c] = 0;

        // Check uniqueness
        int solutionCount = 0;
        countSolutions(grid, solutionCount);

        if (solutionCount != 1)
        {
            grid[r][c] = temp; // Restore if multiple solutions exist
        }
        else
        {
            removed++;
        }
    }
}

void printMachineGrid(int grid[N][N])
{
    for (int i = 0; i < N; i++)
    {
        for (int j = 0; j < N; j++)
        {
            cout << grid[i][j] << (i == N - 1 && j == N - 1 ? "" : " ");
        }
    }
    cout << endl;
}

int main(int argc, char *argv[])
{
    int grid[N][N];

    unsigned seed = static_cast<unsigned>(chrono::high_resolution_clock::now().time_since_epoch().count());
    random_device rd;
    seed ^= rd();
    mt19937 rng(seed);

    if (argc >= 2 && string(argv[1]) == "generate")
    {
        generatePuzzle(grid, rng);
        printMachineGrid(grid);
        return 0;
    }

    if (argc >= 2 && string(argv[1]) == "solve")
    {
        for (int i = 0; i < N; i++)
        {
            for (int j = 0; j < N; j++)
            {
                if (!(cin >> grid[i][j]))
                {
                    cout << "ERROR" << endl;
                    return 1;
                }
            }
        }

        if (solveSudoku(grid))
        {
            printMachineGrid(grid);
            return 0;
        }
        else
        {
            cout << "NO_SOLUTION" << endl;
            return 0;
        }
    }

    cout << "Usage: " << argv[0] << " generate | solve" << endl;
    return 0;
}