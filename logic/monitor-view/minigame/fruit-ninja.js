const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const fruits = [];
const bombs = [];
let score = 0;
let gameOver = false;

class Fruit {
    constructor(x, y, radius, color, velocityY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocityY = velocityY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.y += this.velocityY;
    }
}

class Bomb {
    constructor(x, y, radius, color, velocityY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocityY = velocityY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.y += this.velocityY;
    }
}

function createFruit() {
    const x = Math.random() * (canvas.width - 50) + 25;
    const radius = 20;
    const color = 'orange';
    const velocityY = Math.random() * 3 + 1;
    fruits.push(new Fruit(x, -radius, radius, color, velocityY));
}

function createBomb() {
    const x = Math.random() * (canvas.width - 50) + 25;
    const radius = 15;
    const color = 'red';
    const velocityY = Math.random() * 3 + 1;
    bombs.push(new Bomb(x, -radius, radius, color, velocityY));
}

function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 20, 40);
}

function drawGameOver() {
    ctx.font = '40px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
}

function updateGame() {
    if (!gameOver) {
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
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    fruits.forEach((fruit, index) => {
        const distance = Math.sqrt((mouseX - fruit.x) ** 2 + (mouseY - fruit.y) ** 2);
        if (distance < fruit.radius) {
            fruits.splice(index, 1);
            score++;
            createFruit();
        }
    });

    bombs.forEach((bomb, index) => {
        const distance = Math.sqrt((mouseX - bomb.x) ** 2 + (mouseY - bomb.y) ** 2);
        if (distance < bomb.radius) {
            gameOver = true;
        }
    });
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateGame();

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

createFruit();
createBomb();
gameLoop();
