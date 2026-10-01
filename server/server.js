const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const cppPath = path.join(__dirname, "..", "cpp", "sudoku.exe");

app.get("/", (req, res) => {
    res.send("Sudoku backend is running!");
});

// --------------------------------------------------
// GET /generate
// --------------------------------------------------
app.get("/generate", (req, res) => {
    // Pass ["generate"] as CLI argument
    const process = spawn(cppPath, ["generate"]);

    let output = "";

    process.stdout.on("data", (data) => {
        output += data.toString();
    });

    process.stderr.on("data", (data) => {
        console.error("C++ Error:", data.toString());
    });

    process.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "C++ generation program failed" });
        }

        // Convert "0 8 0 1 ..." string into array of numbers
        const numbers = output.trim().split(/\s+/).map(Number);

        if (numbers.length !== 81) {
            return res.status(500).json({ error: "Invalid board length received" });
        }

        // Optional: Convert 1D array of 81 into 9x9 2D array
        const grid = [];
        for (let i = 0; i < 9; i++) {
            grid.push(numbers.slice(i * 9, (i + 1) * 9));
        }

        res.json({ board: grid, flat: numbers });
    });
});

// --------------------------------------------------
// POST /solve
// Expects JSON body: { "board": [0, 8, 0, ...] } OR 2D array
// --------------------------------------------------
app.post("/solve", (req, res) => {
    const { board } = req.body;

    if (!board) {
        return res.status(400).json({ error: "Missing 'board' in request body" });
    }

    // Convert 2D array to flat 1D array if necessary
    const flatBoard = Array.isArray(board[0]) ? board.flat() : board;

    if (flatBoard.length !== 81) {
        return res.status(400).json({ error: "Board must contain exactly 81 numbers" });
    }

    // Pass ["solve"] as CLI argument
    const process = spawn(cppPath, ["solve"]);

    let output = "";

    process.stdout.on("data", (data) => {
        output += data.toString();
    });

    process.stderr.on("data", (data) => {
        console.error("C++ Error:", data.toString());
    });

    process.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "C++ solver program failed" });
        }

        const trimmed = output.trim();

        if (trimmed === "NO_SOLUTION") {
            return res.status(422).json({ error: "No solution exists for this Sudoku puzzle" });
        }

        if (trimmed === "ERROR") {
            return res.status(400).json({ error: "Invalid grid data supplied" });
        }

        const numbers = trimmed.split(/\s+/).map(Number);

        const grid = [];
        for (let i = 0; i < 9; i++) {
            grid.push(numbers.slice(i * 9, (i + 1) * 9));
        }

        res.json({ solution: grid, flat: numbers });
    });

    // Send board string to standard input
    process.stdin.write(flatBoard.join(" ") + "\n");
    process.stdin.end();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});