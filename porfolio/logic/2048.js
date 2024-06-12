document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('gridContainer');
    const scoreDisplay = document.getElementById('score');
    const gameOverDisplay = document.getElementById('gameOver');
    const restartButton = document.getElementById('restartButton');
    const gridSize = 4;
    let grid = [];
    let score = 0;
    let gameOver = false;

    function initializeGrid() {
        grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
        addRandomTile();
        addRandomTile();
        updateGridDisplay();
    }

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

    function updateGridDisplay() {
        gridContainer.innerHTML = '';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const tileValue = grid[i][j];
                const tileDiv = document.createElement('div');
                tileDiv.classList.add('tile');
                tileDiv.textContent = tileValue === 0 ? '' : tileValue;
                tileDiv.style.backgroundColor = getTileColor(tileValue);
                gridContainer.appendChild(tileDiv);
            }
        }
        scoreDisplay.textContent = score;
    }

    function getTileColor(value) {
        const colors = {
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e',
        };
        return colors[value] || '#cdc1b4';
    }

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
            updateGridDisplay();
            checkGameOver();
        }
    }
    
    function checkGameOver() {
        let gameOver = true;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    gameOver = false;
                    break;
                }
                if (j < gridSize - 1 && grid[i][j] === grid[i][j + 1]) {
                    gameOver = false;
                    break;
                }
                if (i < gridSize - 1 && grid[i][j] === grid[i + 1][j]) {
                    gameOver = false;
                    break;
                }
            }
        }
        if (gameOver) {
            gameOverDisplay.style.display = 'block';
            gameOver = true;
        }
    }

    function restartGame() {
        gridContainer.innerHTML = '';
        gameOverDisplay.style.display = 'none';
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

