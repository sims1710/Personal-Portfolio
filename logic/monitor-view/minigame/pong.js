const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 80;
const paddleOffset = 20;
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

let isPaused = true;
let gameStarted = false;
const playSymbol = document.getElementById('playSymbol');
const pauseSymbol = document.getElementById('pauseSymbol');
const playPauseButton = document.getElementById('playPauseButton');

const winningScore = 20;

// Function for drawing the paddles
function drawPaddles(x, y, width, height, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
}

// Function for drawing the ball
function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
}

// Function for drawing the score
function drawScore(text, x, y, color, font) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y);
}

// Function for drawing the net
function drawNet() {
    ctx.fillStyle = '#003366';
    for (let i = 0; i < canvas.height; i += 20) {
        ctx.fillRect(canvas.width / 2 - 1, i, 2, 10);
    }
}

// Function for drawing the background
function drawBackground() {
    ctx.fillStyle = 'rgb(241, 218, 255)'; 
    const cornerRadius = 20;
    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.lineTo(canvas.width - cornerRadius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, cornerRadius);
    ctx.lineTo(canvas.width, canvas.height - cornerRadius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - cornerRadius, canvas.height);
    ctx.lineTo(cornerRadius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - cornerRadius);
    ctx.lineTo(0, cornerRadius);
    ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
    ctx.closePath();
    ctx.fill();
}

// Function that helps draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    drawNet();

    drawPaddles(paddleOffset, paddle1Y, paddleWidth, paddleHeight, 5, '#336699');
    drawPaddles(canvas.width - paddleWidth - paddleOffset, paddle2Y, paddleWidth, paddleHeight, 5, '#336699');

    drawBall(ballX, ballY, ballSize, '#660033');

    drawScore(computerScore, canvas.width / 5, 50, 'rgb(70, 0, 110)', '48px "M PLUS Rounded 1c"');
    drawScore(playerScore, (3 * canvas.width) / 4.25, 50, 'rgb(70, 0, 110)', '48px "M PLUS Rounded 1c"');

    if (playerScore >= winningScore) {
        drawScore("You Win!", canvas.width - 220, canvas.height / 2, 'rgb(14, 37, 0)', '36px "M PLUS Rounded 1c"');
    } else if (computerScore >= winningScore) {
        drawScore("Computer Wins!", canvas.width - 280, canvas.height / 2, 'rgb(14, 37, 0)', '36px "M PLUS Rounded 1c"');
    }
}

// Function to controlling ball movement
let lastUpdateTime = 0;
function update(currentTime) {
    if (isPaused || !gameStarted) return;

    const deltaTime = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;

    if (playerScore >= winningScore || computerScore >= winningScore) {
        gameStarted = false;
        return;
    }

    // Move paddles
    if (moveDownPressed && paddle2Y + paddleHeight < canvas.height) {
        paddle2Y += paddleSpeed;
    }
    if (moveUpPressed && paddle2Y > 0) {
        paddle2Y -= paddleSpeed;
    }

    // AI movement for computer paddle with some inefficiency
    const paddle1Center = paddle1Y + paddleHeight / 2;
    const targetY = ballY - paddleHeight / 2; 
    const smoothing = 0.01;
    const inaccuracy = 20;

    const randomInaccuracy = (Math.random() * inaccuracy - inaccuracy / 2);
    const adjustedTargetY = targetY + randomInaccuracy;

    paddle1Y += (adjustedTargetY - paddle1Y) * smoothing;

    // Ensure paddle1 stays within canvas bounds
    if (paddle1Y < 0) paddle1Y = 0;
    if (paddle1Y + paddleHeight > canvas.height) paddle1Y = canvas.height - paddleHeight;

    // Move ball
    ballX += ballSpeedX * (deltaTime / 16);
    ballY += ballSpeedY * (deltaTime / 16);

    // Ball collision with top/bottom walls
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (
        ballX - ballSize < paddleWidth + paddleOffset && 
        ballY + ballSize > paddle1Y &&
        ballY - ballSize < paddle1Y + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    } else if (
        ballX + ballSize > canvas.width - paddleWidth - paddleOffset &&
        ballY + ballSize > paddle2Y &&
        ballY - ballSize < paddle2Y + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }
    
    // Ball out of bounds (score)
    if (ballX - ballSize < 0) {
        playerScore++;
        resetBall();
    } else if (ballX + ballSize > canvas.width) {
        computerScore++;
        resetBall();
    }
}

// Function for resetting the ball position
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = Math.random() > 0.5 ? 5 : -5;
    ballSpeedY = Math.random() * 6 - 3;
}

function gameLoop(currentTime) {
    update(currentTime);
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

// Toggling the buttons
playPauseButton.addEventListener('click', function () {
    if (!gameStarted) {
        gameStarted = true;
        isPaused = false;
        lastUpdateTime = performance.now();
        playSymbol.style.display = 'none';
        pauseSymbol.style.display = 'inline';
    } else {
        isPaused = !isPaused;
        if (isPaused) {
            playSymbol.style.display = 'inline';
            pauseSymbol.style.display = 'none';
        } else {
            playSymbol.style.display = 'none';
            pauseSymbol.style.display = 'inline';
        }
    }
});

document.getElementById('resetButton').addEventListener('click', function () {
    playerScore = 0;
    computerScore = 0;
    resetBall();
    isPaused = true;
    gameStarted = false;
    playSymbol.style.display = 'inline';
    pauseSymbol.style.display = 'none';
});

gameLoop();
