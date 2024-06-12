const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 80;
let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;
const paddleSpeed = 5;

const ballSize = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

let playerScore = 0;
let computerScore = 0;

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
}

function drawText(text, x, y, color, font) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, '#fff');
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw net
    drawNet();

    // Draw paddles
    drawRect(0, paddle1Y, paddleWidth, paddleHeight, '#fff');
    drawRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight, '#fff');

    // Draw ball
    drawCircle(ballX, ballY, ballSize, '#fff');

    // Draw scores
    drawText(playerScore, canvas.width / 4, 50, '#fff', '48px Arial');
    drawText(computerScore, (3 * canvas.width) / 4, 50, '#fff', '48px Arial');
}

function update() {
    // Move paddles
    if (moveDownPressed && paddle1Y + paddleHeight < canvas.height) {
        paddle1Y += paddleSpeed;
    }
    if (moveUpPressed && paddle1Y > 0) {
        paddle1Y -= paddleSpeed;
    }

    // AI movement for computer paddle
    const paddle2Center = paddle2Y + paddleHeight / 2;
    if (paddle2Center < ballY - 35) {
        paddle2Y += paddleSpeed;
    } else if (paddle2Center > ballY + 35) {
        paddle2Y -= paddleSpeed;
    }

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom walls
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (
        ballX - ballSize < paddleWidth &&
        ballY + ballSize > paddle1Y &&
        ballY - ballSize < paddle1Y + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    } else if (
        ballX + ballSize > canvas.width - paddleWidth &&
        ballY + ballSize > paddle2Y &&
        ballY - ballSize < paddle2Y + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds (score)
    if (ballX - ballSize < 0) {
        computerScore++;
        resetBall();
    } else if (ballX + ballSize > canvas.width) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = Math.random() > 0.5 ? 5 : -5;
    ballSpeedY = Math.random() * 6 - 3;
}

function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

// Keyboard controls
let moveUpPressed = false;
let moveDownPressed = false;

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp') {
        moveUpPressed = true;
    } else if (event.key === 'ArrowDown') {
        moveDownPressed = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowUp') {
        moveUpPressed = false;
    } else if (event.key === 'ArrowDown') {
        moveDownPressed = false;
    }
});

gameLoop();
