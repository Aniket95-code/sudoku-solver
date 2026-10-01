# Sudoku Generator & Solver

A Sudoku application built with a **C++ backend** and **React frontend**. The C++ engine handles puzzle generation and solving, while React provides an interactive interface.

## Features

* Generate a new random Sudoku puzzle
* Ensure generated puzzles have a unique solution
* Solve Sudoku puzzles using backtracking
* Interactive 9×9 React-based interface
* C++ and React frontend-backend integration

## Tech Stack

* **Frontend:** React, JavaScript, CSS
* **Backend:** C++
* **Algorithms:** Backtracking, randomized puzzle generation
* **Randomization:** `std::mt19937` and `std::shuffle`

## How It Works

### Puzzle Generation

1. Generate a complete valid Sudoku grid using randomized backtracking.
2. Randomly remove cells.
3. Check the puzzle's solution count after each removal.
4. Keep the removal only if the puzzle still has exactly one solution.

### Puzzle Solving

The solver uses recursive backtracking to find valid values for empty cells until the puzzle is solved.

## Project Structure

```text
sudoku-project/
├── backend/
│   ├── sudoku.cpp
│   └── sudoku.exe
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── README.md
```

## Backend Commands

Generate a random puzzle:

```bash
sudoku.exe generate
```

Solve a puzzle:

```bash
sudoku.exe solve
```

The backend communicates with the React frontend using a machine-readable 81-cell Sudoku grid format.

## Running the Project

### Backend

```bash
g++ sudoku.cpp -o sudoku.exe
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite to use the application.

## Project Goal

The project demonstrates the integration of **C++ algorithmic logic with a modern React interface**, combining randomized Sudoku generation, unique-solution verification, and backtracking-based solving.
