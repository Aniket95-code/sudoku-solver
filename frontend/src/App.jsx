import { useState } from "react";
import "./App.css";

const initialGrid = [
  [3, 0, 6, 5, 0, 8, 4, 0, 0],
  [5, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 8, 7, 0, 0, 0, 0, 3, 1],
  [0, 0, 3, 0, 1, 0, 0, 8, 0],
  [9, 0, 0, 8, 6, 3, 0, 0, 5],
  [0, 5, 0, 0, 9, 0, 6, 0, 0],
  [1, 3, 0, 0, 0, 0, 2, 5, 0],
  [0, 0, 0, 0, 0, 0, 0, 7, 4],
  [0, 0, 5, 2, 0, 6, 3, 0, 0],
];

function App() {
  const [grid, setGrid] = useState(initialGrid);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (row, col, value) => {
    if (value !== "" && !/^[1-9]$/.test(value)) return;

    const newGrid = grid.map((r) => [...r]);

    newGrid[row][col] = value === "" ? 0 : Number(value);

    setGrid(newGrid);
  };

 const solveSudoku = async () => {
  setLoading(true);
  setMessage("");

  try {
    const response = await fetch("http://localhost:5000/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board: grid, // Changed from 'grid' to 'board'
      }),
    });

    const data = await response.json();

    if (response.ok && data.solution) {
      setGrid(data.solution); // Uses data.solution instead of data.grid
      setMessage("Sudoku solved successfully.");
    } else {
      setMessage(data.error || "No solution exists for this Sudoku.");
    }
  } catch (error) {
    setMessage("Could not connect to the backend. Make sure the server is running on port 5000.");
  }

  setLoading(false);
};

  const generateNewPuzzle = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/generate");
      const data = await response.json();

      if (response.ok && data.board) {
        setGrid(data.board);
        setMessage("New puzzle generated!");
      } else {
        setMessage(data.error || "Failed to generate puzzle.");
      }
    } catch (error) {
      setMessage("Could not connect to the backend to generate puzzle.");
    }

    setLoading(false);
  };

  const clearGrid = () => {
    setGrid(
      Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => 0)
      )
    );

    setMessage("");
  };

  const loadExample = () => {
    setGrid(initialGrid);
    setMessage("");
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Sudoku Solver</h1>

        <p className="subtitle">
          React Frontend + C++ Backtracking Algorithm
        </p>

        <div className="sudoku-board">
          {grid.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                className={`
                  cell
                  ${colIndex === 2 || colIndex === 5 ? "right-border" : ""}
                  ${rowIndex === 2 || rowIndex === 5 ? "bottom-border" : ""}
                `}
                type="text"
                maxLength="1"
                value={value === 0 ? "" : value}
                onChange={(e) =>
                  handleChange(
                    rowIndex,
                    colIndex,
                    e.target.value
                  )
                }
              />
            ))
          )}
        </div>

        <div className="buttons">
          <button onClick={solveSudoku} disabled={loading}>
            {loading ? "Solving..." : "Solve Sudoku"}
          </button>

          <button className="secondary" onClick={generateNewPuzzle} disabled={loading}>
            Generate New Puzzle
          </button>

          <button className="secondary" onClick={loadExample}>
            Load Example
          </button>

          <button className="danger" onClick={clearGrid}>
            Clear
          </button>
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;