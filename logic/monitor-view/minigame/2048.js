document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const gameOverDisplay = document.getElementById('gameOver');
    const restartButton = document.getElementById('restartButton');
    const gridSize = 4;
    const tileSize = 62; 
    const gridPadding = 10; 
    let grid = [];
    let score = 0;
    let gameOver = false;

    // Function for displaying game over
    function drawGameOver() {
        ctx.font = '48px "M PLUS Rounded 1c"';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    }

    // Function for displaying congratulations
    function drawCongratulations() {
        ctx.font = '36px "M PLUS Rounded 1c"';
        ctx.fillStyle = 'green';
        ctx.fillText('Congratulations!', canvas.width / 2, canvas.height / 2);
    }
    
    // Function for initialising the grid
    function initializeGrid() {
        grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
        addRandomTile();
        addRandomTile();
        updateCanvas();
    }

    // Function for randomly inserting a tile
    function addRandomTile() {
        const availableCells = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    availableCells.push({ row: i, col: j });
                }
            }
        }
        if (availableCells.length > 0) {
            const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
            grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // Function for updating the canvas
    function updateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgb(241, 218, 255)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const tileValue = grid[i][j];
                const x = j * (tileSize + gridPadding) + gridPadding;
                const y = i * (tileSize + gridPadding) + gridPadding;
                ctx.fillStyle = getTileColor(tileValue);
                ctx.fillRect(x, y, tileSize, tileSize);

                if (tileValue !== 0) {
                    ctx.font = 'bold 24px "M PLUS Rounded 1c"';
                    ctx.fillStyle = '#f0f0f0'; 
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(tileValue, x + tileSize / 2, y + tileSize / 2);
                }
            }
        }

        scoreDisplay.textContent = `Score: ${score}`;
    }

    // Function to colour according to number
    function getTileColor(value) {
        const colors = {
            2: '#d1c4e9',
            4: '#b39ddb',
            8: '#9575cd',
            16: '#7e57c2',
            32: '#673ab7',
            64: '#5e35b1',
            128: '#512da8',
            256: '#4527a0',
            512: '#311b92',
            1024: '#2a1b5f',
            2048: '#1a237e',
        };
        return colors[value] || 'rgb(242, 230, 249)';
    }

    // Function for moving the tiles and changing the numbers
    function move(direction) {
        if (gameOver) return;
        let moved = false;

        if (direction === 'up') {
            for (let j = 0; j < gridSize; j++) {
                for (let i = 1; i < gridSize; i++) {
                    if (grid[i][j] !== 0) {
                        let row = i;
                        while (row > 0 && grid[row - 1][j] === 0) {
                            grid[row - 1][j] = grid[row][j];
                            grid[row][j] = 0;
                            row--;
                            moved = true;
                        }
                        if (row > 0 && grid[row - 1][j] === grid[row][j]) {
                            grid[row - 1][j] *= 2;
                            score += grid[row - 1][j];
                            grid[row][j] = 0;
                            moved = true;
                        }
                    }
                }
            }
        } else if (direction === 'down') {
            for (let j = 0; j < gridSize; j++) {
                for (let i = gridSize - 2; i >= 0; i--) {
                    if (grid[i][j] !== 0) {
                        let row = i;
                        while (row < gridSize - 1 && grid[row + 1][j] === 0) {
                            grid[row + 1][j] = grid[row][j];
                            grid[row][j] = 0;
                            row++;
                            moved = true;
                        }
                        if (row < gridSize - 1 && grid[row + 1][j] === grid[row][j]) {
                            grid[row + 1][j] *= 2;
                            score += grid[row + 1][j];
                            grid[row][j] = 0;
                            moved = true;
                        }
                    }
                }
            }
        } else if (direction === 'left') {
            for (let i = 0; i < gridSize; i++) {
                for (let j = 1; j < gridSize; j++) {
                    if (grid[i][j] !== 0) {
                        let col = j;
                        while (col > 0 && grid[i][col - 1] === 0) {
                            grid[i][col - 1] = grid[i][col];
                            grid[i][col] = 0;
                            col--;
                            moved = true;
                        }
                        if (col > 0 && grid[i][col - 1] === grid[i][col]) {
                            grid[i][col - 1] *= 2;
                            score += grid[i][col - 1];
                            grid[i][col] = 0;
                            moved = true;
                        }
                    }
                }
            }
        } else if (direction === 'right') {
            for (let i = 0; i < gridSize; i++) {
                for (let j = gridSize - 2; j >= 0; j--) {
                    if (grid[i][j] !== 0) {
                        let col = j;
                        while (col < gridSize - 1 && grid[i][col + 1] === 0) {
                            grid[i][col + 1] = grid[i][col];
                            grid[i][col] = 0;
                            col++;
                            moved = true;
                        }
                        if (col < gridSize - 1 && grid[i][col + 1] === grid[i][col]) {
                            grid[i][col + 1] *= 2;
                            score += grid[i][col + 1];
                            grid[i][col] = 0;
                            moved = true;
                        }
                    }
                }
            }
        }

        if (moved) {
            addRandomTile();
            updateCanvas();
            checkGameOver();
            checkGameWin(); 
        }
    }

    // Function for checking if the game is over
    function checkGameOver() {
        let gameIsOver = true;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    gameIsOver = false;
                    break;
                }
                if (j < gridSize - 1 && grid[i][j] === grid[i][j + 1]) {
                    gameIsOver = false;
                    break;
                }
                if (i < gridSize - 1 && grid[i][j] === grid[i + 1][j]) {
                    gameIsOver = false;
                    break;
                }
            }
        }
        if (gameIsOver) {
            drawGameOver();
            gameOver = true;
        }
    }

    // Function for checking if the game is won
    function checkGameWin() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 2048) {
                    drawCongratulations();
                    gameOver = true;
                    return;
                }
            }
        }
    }

    // Function for restarting the game
    function restartGame() {
        grid = [];
        score = 0;
        gameOver = false;
        initializeGrid();
    }

    restartButton.addEventListener('click', restartGame);
    initializeGrid();

    window.addEventListener('keydown', event => {
        switch (event.key) {
            case 'ArrowUp':
                move('up');
                break;
            case 'ArrowDown':
                move('down');
                break;
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
        }
    });
});
