function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }
    const getBoard = () => board;

    const drawCell = (row, column, token) => {
        if (!board[row][column].getValue() === 0) return;
        board[row][column].addToken(token)

    }

    return { getBoard, drawCell }

};

function Cell() {
    let value = 0;

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
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            const cellA = board[a[0]][a[1]].getValue();
            const cellB = board[b[0]][b[1]].getValue();
            const cellC = board[c[0]][c[1]].getValue();

            if (cellA !== 0 && cellA === cellB && cellB === cellC) {
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

}