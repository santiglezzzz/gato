const board = Array(9).fill("");
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const boardElement = document.querySelector("#game-board");
const statusElement = document.querySelector("#game-status");
const scoreXElement = document.querySelector("#score-x");
const scoreOElement = document.querySelector("#score-o");
const restartRoundButton = document.querySelector("#restart-round");
const resetGameButton = document.querySelector("#reset-game");

let currentPlayer = "X";
let gameOver = false;
let scores = { X: 0, O: 0 };

function renderBoard() {
    boardElement.replaceChildren();

    board.forEach((mark, index) => {
        const cell = document.createElement("button");
        cell.className = "cell";
        cell.type = "button";
        cell.dataset.index = index;
        cell.setAttribute("aria-label", `Casilla ${index + 1}, ${mark || "vacía"}`);
        cell.textContent = mark;

        if (mark) {
            cell.classList.add(`cell--${mark.toLowerCase()}`);
            cell.disabled = true;
        }

        boardElement.append(cell);
    });
}

function getWinningCombination() {
    return winningCombinations.find(([first, second, third]) =>
        board[first] && board[first] === board[second] && board[first] === board[third]
    );
}

function playTurn(event) {
    const cell = event.target.closest(".cell");

    if (!cell || gameOver) {
        return;
    }

    const index = Number(cell.dataset.index);

    if (board[index]) {
        return;
    }

    board[index] = currentPlayer;
    renderBoard();

    const winningCombination = getWinningCombination();

    if (winningCombination) {
        gameOver = true;
        scores[currentPlayer] += 1;
        updateScores();
        boardElement.querySelectorAll(".cell").forEach((remainingCell) => {
            remainingCell.disabled = true;
        });
        winningCombination.forEach((winningIndex) => {
            boardElement.children[winningIndex].classList.add("cell--winner");
        });
        statusElement.textContent = `¡Gana el jugador ${currentPlayer === "X" ? "1 (X)" : "2 (O)"}!`;
        return;
    }

    if (board.every(Boolean)) {
        gameOver = true;
        statusElement.textContent = "¡Empate! No quedan casillas libres.";
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
}

function updateStatus() {
    const playerNumber = currentPlayer === "X" ? "1" : "2";
    statusElement.textContent = `Turno del jugador ${playerNumber} (${currentPlayer})`;
}

function updateScores() {
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
}

function startNewRound() {
    board.fill("");
    currentPlayer = "X";
    gameOver = false;
    renderBoard();
    updateStatus();
}

function resetGame() {
    scores = { X: 0, O: 0 };
    updateScores();
    startNewRound();
}

boardElement.addEventListener("click", playTurn);
restartRoundButton.addEventListener("click", startNewRound);
resetGameButton.addEventListener("click", resetGame);

renderBoard();
updateStatus();