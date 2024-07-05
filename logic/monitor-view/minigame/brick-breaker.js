const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(241, 218, 255)';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Paddle setup
const paddleWidth = 75;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

// Ball setup
const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 2;
let ballDY = -2;

// Brick setup
const brickRowCount = 5;
const brickColumnCount = 4;
const brickWidth = 50;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = (canvas.width - (brickColumnCount * (brickWidth + brickPadding) - brickPadding)) / 2; // Center bricks

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Game variables
let score = 0;
let lives = 3;
let gamePaused = true;
let gameOver = false;

// Button setup
const playButton = document.getElementById('playButton');
const playSymbol = document.getElementById('playSymbol');

playButton.addEventListener('click', () => {
    if (gameOver) {
        resetGame();
        gameOver = false;
    }
    gamePaused = false;
    playSymbol.textContent = 'replay';
    draw();
});

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('mousemove', handleMouseMove);

function handleKeyDown(event) {
    if (event.key === 'ArrowLeft' && paddleX > 0) {
        paddleX -= 7;
    } else if (event.key === 'ArrowRight' && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
}

function handleMouseMove(event) {
    const relativeX = event.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// Function for drawing paddle
function drawPaddle() {
    ctx.beginPath();
    let radius = paddleHeight / 2; 
    let roundedEndHeight = paddleHeight - radius; 
    let roundedEndWidth = radius;
    ctx.moveTo(paddleX + radius, canvas.height - paddleHeight);
    ctx.lineTo(paddleX + paddleWidth - radius, canvas.height - paddleHeight);
    ctx.arc(paddleX + paddleWidth - radius, canvas.height - roundedEndHeight, radius, 0, Math.PI / 2);
    ctx.lineTo(paddleX + roundedEndWidth, canvas.height);
    ctx.arc(paddleX + roundedEndWidth, canvas.height - roundedEndHeight, radius, Math.PI / 2, Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#336699';
    ctx.fill();
}

// Function for drawing ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#660033';
    ctx.fill();
    ctx.closePath();
}

// Function for drawing bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#663399';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Function for collision detection
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                if (
                    ballX > brick.x &&
                    ballX < brick.x + brickWidth &&
                    ballY > brick.y &&
                    ballY < brick.y + brickHeight
                ) {
                    ballDY = -ballDY;
                    brick.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        gamePaused = true;
                        drawCongratulations();
                    }
                }
            }
        }
    }
}

// Function for displaying score
function drawScore() {
    ctx.font = '16px "M PLUS Rounded 1c"'
    ctx.fillStyle = 'rgb(70, 0, 110)';
    ctx.fillText('Score: ' + score, 8, 20);
}

// Function for displaying lives
function drawLives() {
    ctx.font = '16px "M PLUS Rounded 1c"';
    ctx.fillStyle = 'rgb(70, 0, 110)';
    ctx.fillText('Lives: ' + Math.max(lives, 0), canvas.width - 65, 20);
}

// Function for displaying game over
function drawGameOver() {
    ctx.font = '48px "M PLUS Rounded 1c"';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
}

// Function for displaying congratulations
function drawCongratulations() {
    ctx.font = '36px "M PLUS Rounded 1c"';
    ctx.fillStyle = 'green';
    ctx.fillText('Congratulations!', canvas.width / 2 - 140, canvas.height / 2);
}

// Function that draws everything
function draw() {
    if (!gamePaused && !gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgb(241, 218, 255)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawPaddle();
        drawBall();
        drawScore();
        drawLives();
        collisionDetection();

        if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
            ballDX = -ballDX;
        }
        if (ballY + ballDY < ballRadius) {
            ballDY = -ballDY;
        } else if (ballY + ballDY > canvas.height - ballRadius) {
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                ballDY = -ballDY;
            } else {
                lives--;
                if (!lives) {
                    gameOver = true;
                } else {
                    ballX = canvas.width / 2;
                    ballY = canvas.height - 30;
                    ballDX = 2;
                    ballDY = -2;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        ballX += ballDX;
        ballY += ballDY;

        requestAnimationFrame(draw);
    } else if (gameOver) {
        drawGameOver();
    }
}

// Function that resets the game
function resetGame() {
    score = 0;
    lives = 1;
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballDX = 2;
    ballDY = -2;
    paddleX = (canvas.width - paddleWidth) / 2;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
    gamePaused = false;
    gameOver = false;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

