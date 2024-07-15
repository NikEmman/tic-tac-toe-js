function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];


    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }



    const getBoard = () => board;

    const drawCell = (row, column, token) => {
        if (!board[row][column].getValue()) {
            board[row][column].addToken(token);
        }
    };

    return { getBoard, drawCell };

}

function Cell() {
    let value = "";

    const addToken = (token) => {
        value = token;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
};

function GameController(playerOne, playerTwo) {
    const board = GameBoard();
    const players = [
        {
            name: playerOne,
            token: "X"
        },
        {
            name: playerTwo,
            token: "O"
        }
    ]
    let currentPlayer = players[0]

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0]
    };
    const getCurrentPlayer = () => currentPlayer

    const checkWin = () => {
        const actualBoard = board.getBoard()
        const winningCombinations = [
            [actualBoard[0][0], actualBoard[0][1], actualBoard[0][2]],
            [actualBoard[1][0], actualBoard[1][1], actualBoard[1][2]],
            [actualBoard[2][0], actualBoard[2][1], actualBoard[2][2]],
            [actualBoard[0][0], actualBoard[1][0], actualBoard[2][0]],
            [actualBoard[0][1], actualBoard[1][1], actualBoard[2][1]],
            [actualBoard[0][2], actualBoard[1][2], actualBoard[2][2]],
            [actualBoard[0][0], actualBoard[1][1], actualBoard[2][2]],
            [actualBoard[0][2], actualBoard[1][1], actualBoard[2][0]]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            const cellA = a.getValue();
            const cellB = b.getValue();
            const cellC = c.getValue();

            if ((cellA !== "") && (cellA === cellB) && (cellB === cellC)) return true;

        }
        return false;

    }

    const checkBoardFull = () => board.getBoard().every(row => row.every(cell => cell.getValue() !== ""));

    const checkGameEnd = () => (checkWin() || checkBoardFull());


    const playRound = (row, column) => {

        board.drawCell(row, column, getCurrentPlayer().token)
        switchPlayerTurn()
    };
    const getGameResult = () => {
        if (checkWin()) {
            switchPlayerTurn()
            return `Amazing game, ${currentPlayer.name} is the winner!`
        }
        else if (checkBoardFull()) {
            return "Good game, it's a draw!"

        }
    }


    return { getCurrentPlayer, playRound, checkGameEnd, getGameResult, getBoard: board.getBoard };

};

function ScreenController() {
    let game;
    const boardDiv = document.querySelector(".board")
    const playerOne = document.getElementById("playerOne")
    const playerTwo = document.getElementById("playerTwo")

    const turnDiv = document.querySelector(".turn")
    const startBtn = document.querySelector(".startBtn")
    const restartBtn = document.querySelector(".restartBtn")

    const render = () => {
        boardDiv.textContent = ""
        const board = game.getBoard();
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex
                cellButton.dataset.column = columnIndex
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })



    }
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        const cell = game.getBoard()[selectedRow][selectedColumn].getValue()
        if (!selectedColumn || (cell !== "") || game.checkGameEnd()) return;
        game.playRound(selectedRow, selectedColumn);
        updateMessage();
        render();
        const clickedCell = document.querySelector(`[data-row="${selectedRow}"][data-column="${selectedColumn}"]`)
        clickedCell.classList.add("clicked")

    }
    function updateMessage() {
        turnDiv.textContent = game.checkGameEnd() ? game.getGameResult() : `It's ${game.getCurrentPlayer().name}'s turn`;
    }
    function restartGame() {
        emptyContents()
        revealButtons()
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
    restartBtn.addEventListener("click", restartGame);
    function startGame() {
        const p1 = playerOne.value || "Player One";
        const p2 = playerTwo.value || "Player Two";
        game = GameController(p1, p2);
        render();
        hideButtons()
    }
    function emptyContents() {
        playerOne.value = ""
        playerTwo.value = ""
        turnDiv.textContent = "";
        boardDiv.textContent = ""
    }
    function hideButtons() {
        startBtn.classList.add("hidden");
        playerOne.classList.add("hidden");
        playerTwo.classList.add("hidden");
    }
    function revealButtons() {
        startBtn.classList.remove("hidden");
        playerOne.classList.remove("hidden");
        playerTwo.classList.remove("hidden");

    }
    startBtn.addEventListener("click", startGame)

}


ScreenController()