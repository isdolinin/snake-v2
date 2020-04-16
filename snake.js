let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let cellWidth = 38;
let cellHeight = 38;
let fieldWidth = canvas.width / 40;
let fieldHeight = canvas.height / 40;

var pscore = document.getElementById("score");
var phighscore = document.getElementById("highScore");
var startButton = document.getElementById("startButton");
var pauseButton = document.getElementById("pauseButton");

let score = 0;
let highScore = 0;
let startSpeed = 250;
let speed = startSpeed;
let maxSpeed = 100;
let accelerateSpeed = 10;
let accelerateSteps = 15;

let pause = false;
let screen = 'START';

let apple = { x: -1, y: -1 };
let snake = [];
let direction = 'UP';
let newDirection = 'UP';

// Вспомогательные функции

function randomXY(cell) {
	cell.x = Math.floor(Math.random() * fieldWidth);
	cell.y = Math.floor(Math.random() * fieldHeight);
}

// Обработка кнопок управления

document.addEventListener("keydown", keyFunctions, false);
function keyFunctions(e) {
	switch (e.which) {
		case 37:
			newDirection = "LEFT";
			break;
		case 38:
			newDirection = "UP";
			break;
		case 39:
			newDirection = "RIGHT";
			break;
		case 40:
			newDirection = "DOWN";
			break;
		case 27:
			screen = 'START';
			break;
		case 32:
			if (screen === 'GAME') {
				screen = 'PAUSE';
			} else if (screen === 'PAUSE') {
				screen = 'GAME';
			}
		//	break;
		default:
			if (screen === 'GAME OVER') {
				screen = 'START';
			} else if (screen === 'START') {
				startGame();
				screen = 'GAME';
			}
			break;
	}
}

// Игровые функции

function resetGame() {
	stepCounter = 0;
	score = 0;
	speed = startSpeed;
	apple = { x: -1, y: -1 };
	setApple(apple);
	snake = [];
	snake[0] = { x: parseInt(fieldWidth/2), y: parseInt(fieldHeight/2)-1};
	snake[1] = { x: parseInt(fieldWidth/2), y: parseInt(fieldHeight/2)};
	snake[2] = { x: parseInt(fieldWidth/2), y: parseInt(fieldHeight/2)+1};
	direction = 'UP';
	newDirection = 'UP';
	gameover = false;
}

function setApple() {
	if (apple.x === -1) {
		randomXY(apple)
	}
	let check = true;
	while (check) {
		check = false;
		for (let i = 0; i < snake.length; i++)
			if (snake[i].x === apple.x && snake[i].y === apple.y) {
				randomXY(apple);
				check = true;
			}
	}
}

function checkDirection() {
	if (direction === 'LEFT' && newDirection !== 'RIGHT') direction = newDirection;
	if (direction === 'UP' && newDirection !== 'DOWN') direction = newDirection;
	if (direction === 'DOWN' && newDirection !== 'UP') direction = newDirection;
	if (direction === 'RIGHT' && newDirection !== 'LEFT') direction = newDirection;
}


function snakeMove() {
	if (direction === 'LEFT')
		snake.unshift({ x: snake[0].x - 1, y: snake[0].y });
	if (direction === 'RIGHT')
		snake.unshift({ x: snake[0].x + 1, y: snake[0].y });
	if (direction === 'UP')
		snake.unshift({ x: snake[0].x, y: snake[0].y - 1 });
	if (direction === 'DOWN')
		snake.unshift({ x: snake[0].x, y: snake[0].y + 1 });
	if (snake[0].x === apple.x && snake[0].y === apple.y) {
		checkApple();
		setApple();
	} else
		snake.pop();
}

function snakeCheck() {
	/*
	if (snake[0].x < 0 ) 
        snake[0].x = fieldWidth-1;
    if (snake[0].x > fieldWidth-1 ) 
        snake[0].x = 0;
    if (snake[0].y < 0 ) 
        snake[0].y = fieldHeight-1;
    if (snake[0].y > fieldHeight-1 ) 
        snake[0].y = 0; 
	*/
	if (snake[0].x < 0 || snake[0].y < 0 || snake[0].x > fieldWidth - 1 || snake[0].y > fieldHeight - 1) {
		screen = 'GAME OVER';
	}
	for (let i = 2; i < snake.length; i++) {
		if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
			screen = 'GAME OVER';
		}
	}
	if (highScore < score)
		highScore = score;
}

function checkApple() {
	if (snake[0].x === apple.x && snake[0].y === apple.y) {
		apple.x = -1;
		score += 1;
	}
}

// Обработчики кнопок

function startGame() {
	startButton.blur();
	resetGame();
	clearInterval(game);
	game = setInterval(draw, speed);
	screen = "GAME";
}

function pauseGame() {
	pauseButton.blur();
	if (screen === 'GAME') {
		screen = 'PAUSE';
	} else if (screen === 'PAUSE') {
		screen = 'GAME';
	}
}

// Вывод результатов вне canvas

function showScore() {
	pscore.innerHTML = "SCORE: " + score;
	phighscore.innerHTML = "HIGH SCORE: " + highScore;
}


// Функции рисования экранов и объектов

function drawSnake() {
	for (let i = 0; i < snake.length; i++) {
		ctx.beginPath();
		ctx.rect(snake[i].x * 40, snake[i].y * 40, cellWidth, cellHeight);
		if (snake[i].x === apple.x && snake[i].y === apple.y && i != 0) {
			ctx.fillStyle = '#FF3333';
		} else {
			ctx.fillStyle = '#222222';
		}
		ctx.fill();
		ctx.closePath();
	}
}

function drawApple() {
	ctx.beginPath();
	ctx.rect(apple.x * 40, apple.y * 40, cellWidth, cellHeight);
	ctx.fillStyle = '#FF0000'
	ctx.fill();
	ctx.closePath();
}

function drawPause() {
	ctx.beginPath();
	ctx.font = "30px Arial";
	ctx.fillText("Pause", canvas.width / 2 - 55, canvas.height / 2);
	ctx.closePath();
}

function drawGameOver() {
	ctx.beginPath();
	ctx.font = "50px Arial";
	ctx.fillText("Game over", canvas.width / 2 - 125, canvas.height / 2);
	ctx.font = "30px Arial";
	ctx.fillText("Score: " + score, canvas.width / 2 - 55, canvas.height / 2 + 50);
	ctx.closePath();
}

function drawStart() {
	ctx.beginPath();
	ctx.font = "50px Arial";
	ctx.fillText("Start", canvas.width / 2 - 55, canvas.height / 2);
	ctx.closePath();
}

function drawHighScore() {
	ctx.beginPath();
	ctx.font = "30px Arial";
	ctx.fillText("High score: " + highScore, canvas.width / 2 - 85, canvas.height / 2 + 55);
	ctx.closePath();
}

// Цикл отрисовки игры

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (screen === 'START') {
		drawStart();
		drawHighScore()
	} else if (screen === 'PAUSE') {
		drawPause();
	} else if (screen === 'GAME OVER') {
		drawGameOver();
	} else if (screen === 'GAME') {
		gameCycle();
	}
}

function gameCycle() {
	checkDirection();
	snakeMove();
	snakeCheck();
	drawApple();
	drawSnake();
	accelerate();
	showScore();
}

// Запуск игры и ускорение

let game = setInterval(draw, speed);

let stepCounter = 0;
function accelerate() {
	if (!pause) {
		stepCounter++;
		if (stepCounter > accelerateSteps && speed>maxSpeed) {
			speed -= accelerateSpeed;
			stepCounter = 0;
			clearInterval(game);
			game = setInterval(draw, speed);
		}
	}
}
