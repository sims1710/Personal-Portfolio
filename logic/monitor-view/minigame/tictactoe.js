const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const cellSize = 100;
const boardSize = 3;
const board = [['', '', ''], ['', '', ''], ['', '', '']];

let currentPlayer = 'X';
let winner = null;

canvas.addEventListener('click', handleCanvasClick);

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgb(241, 218, 255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgb(70, 0, 110)';
    ctx.lineWidth = 2;

    for (let i = 1; i < boardSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cellValue = board[row][col];
            if (cellValue !== '') {
                ctx.font = '48px Arial';
                ctx.fillStyle = cellValue === 'X' ? 'blue' : 'red';
                ctx.fillText(cellValue, col * cellSize + 25, row * cellSize + 75);
            }
        }
    }

    if (winner !== null) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.fillText(`${winner} wins!`, 50, canvas.height / 2);
    }
}

function handleCanvasClick(event) {
    if (winner !== null) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const col = Math.floor(mouseX / cellSize);
    const row = Math.floor(mouseY / cellSize);

    if (board[row][col] === '') {
        board[row][col] = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        checkWinner();
        drawBoard();
    }
}

function checkWinner() {
    // Check rows
    for (let i = 0; i < boardSize; i++) {
        if (board[i][0] !== '' && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
            winner = board[i][0];
            return;
        }
    }

    // Check columns
    for (let i = 0; i < boardSize; i++) {
        if (board[0][i] !== '' && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
            winner = board[0][i];
            return;
        }
    }

    // Check diagonals
    if (board[0][0] !== '' && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        winner = board[0][0];
        return;
    }
    if (board[0][2] !== '' && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        winner = board[0][2];
        return;
    }

    // Check for tie
    if (!board.flat().includes('')) {
        winner = 'Tie';
    }
}

function resetGame() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            board[row][col] = '';
        }
    }
    currentPlayer = 'X';
    winner = null;
    drawBoard();
}

drawBoard();
