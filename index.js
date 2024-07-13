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

function GameController(playerOne = "Player One", playerTwo = "Player Two") {
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
    const currentPlayer = players[0]

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0]
    };
    const getCurrentPlayer = () => currentPlayer

    const checkWin = () => {
        const winningCombinations = [
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            [board[0][0], board[1][1], board[2][2]],
            [board[0][2], board[1][1], board[2][0]]
        ];

        for (combination of winningCombinations) {
            const [a, b, c] = combination;
            const cellA = a.getValue();
            const cellB = b.getValue();
            const cellC = c.getValue();

            if (cellA && (cellA === cellB) && (cellB === cellC)) {
                return true;
            }
        }

        return false;
    }

    const checkBoardFull = () => board.every(row => row.every(cell => cell.getValue() !== 0));

    const checkGameEnd = () => (checkWin() || checkBoardFull());


    const playRound = (row, column) => {
        board.drawCell(row, column, getCurrentPlayer().token)
        if (checkGameEnd()) return;
        switchPlayerTurn()
    };

    // const restart = () => {
    //     board = GameBoard();
    //     currentPlayer = players[0]

    // }


    return { getCurrentPlayer, playRound, getBoard: board.getBoard };

};

function ScreenController() {
    const game = GameController()
    const boardDiv = document.querySelector(".board")

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
        // Make sure I've clicked a column and not the gaps in between
        if (!selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        render();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    render();

}


ScreenController()