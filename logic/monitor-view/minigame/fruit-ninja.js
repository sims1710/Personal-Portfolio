const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameButton = document.getElementById('gameButton');
const scoreDisplay = document.getElementById('scoreDisplay');

let gameRunning = false;
let gameOver = false;
let score = 0;
const fruits = [];
const bombs = [];

const fruitImage = new Image();
fruitImage.src = '/images/fruit.png';

const bombImage = new Image();
bombImage.src = '/images/bomb.png';

ctx.fillStyle = 'rgb(241, 218, 255)';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Defining the fruit
class Fruit {
    constructor(x, y, radius, velocityY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityY = velocityY;
    }

    update() {
        this.y += this.velocityY;
    }

    draw() {
        ctx.drawImage(fruitImage, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
}

// Defining the bomb
class Bomb {
    constructor(x, y, radius, velocityY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityY = velocityY;
    }

    update() {
        this.y += this.velocityY;
    }

    draw() {
        ctx.drawImage(bombImage, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
}

// Function to draw a fruit at a random position and with random speed
function createFruit() {
    const x = Math.random() * (canvas.width - 50) + 25;
    const radius = 30;
    const velocityY = Math.random() * 3 + 1;
    fruits.push(new Fruit(x, -radius, radius, velocityY));
}

// Function to draw a bomb at a random position and with random speed
function createBomb() {
    const x = Math.random() * (canvas.width - 50) + 25;
    const radius = 25;
    const velocityY = Math.random() * 3 + 1;
    bombs.push(new Bomb(x, -radius, radius, velocityY));
}

// Function to display score
function drawScore() {
    scoreDisplay.innerText = `Score: ${score}`;
}

// Function to display game over message
function drawGameOver() {
    ctx.font = '36px "M PLUS Rounded 1c"';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
}

// Function to update the game
function updateGame() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgb(241, 218, 255)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        fruits.forEach(fruit => {
            fruit.update();
            fruit.draw();
        });

        bombs.forEach(bomb => {
            bomb.update();
            bomb.draw();
        });

        fruits.forEach((fruit, index) => {
            if (fruit.y + fruit.radius > canvas.height) {
                fruits.splice(index, 1);
                createFruit();
            }
        });

        bombs.forEach((bomb, index) => {
            if (bomb.y + bomb.radius > canvas.height) {
                bombs.splice(index, 1);
                createBomb();
            }
        });
    }

    drawScore();
    if (gameOver) {
        drawGameOver();
    }
}

canvas.addEventListener('mousedown', event => {
    if (gameRunning && !gameOver) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        let fruitClicked = false;
        fruits.forEach((fruit, index) => {
            const distance = Math.sqrt((mouseX - fruit.x) ** 2 + (mouseY - fruit.y) ** 2);
            if (distance < fruit.radius) {
                fruits.splice(index, 1);
                score++;
                createFruit();
                fruitClicked = true;
            }
        });

        let bombClicked = false;
        bombs.forEach((bomb, index) => {
            const distance = Math.sqrt((mouseX - bomb.x) ** 2 + (mouseY - bomb.y) ** 2);
            if (distance < bomb.radius) {
                gameOver = true;
                gameRunning = false;
                drawGameOver();
                gameButton.innerHTML = '<span class="material-symbols-outlined replay">replay</span>';
                bombClicked = true;
            }
        });

        if (fruitClicked || bombClicked) {
            requestAnimationFrame(gameLoop);
        }
    }
});

// Function for looping until end of game
function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateGame();
        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        }
    }
}

gameButton.addEventListener('click', () => {
    if (!gameRunning) {
        gameRunning = true;
        gameOver = false;
        score = 0;
        fruits.length = 0;
        bombs.length = 0;
        createFruit();
        createBomb();
        gameButton.innerHTML = '<span class="material-symbols-outlined replay">replay</span>';
        gameLoop();
    } else {
        // Restart the game
        gameRunning = false;
        gameOver = false;
        score = 0;
        fruits.length = 0;
        bombs.length = 0;
        gameButton.innerHTML = '<span class="material-symbols-outlined replay">replay</span>';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgb(241, 218, 255)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawScore();
    }
});
