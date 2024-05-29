import { eventListener, direction, resetDirection, pause } from "./controls.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

const snakeHeadImage = new Image();
snakeHeadImage.src = 'img/z1.jpg';
const snakeBodyImage = new Image();
snakeBodyImage.src = 'img/z3.jpg';
const snakeTailImage = new Image();
snakeTailImage.src = 'img/z2.jpg';

const appleImages = [
    'img/ap.png',
    'img/ap2.jpg',
    'img/ap3.jpg',
    'img/ap4.jpg',
    'img/ap5.jpg',
    'img/ap6.jpg'
];

let apples = [];

const appleImagesLoaded = [];
appleImages.forEach(src => {
    const image = new Image();
    image.src = src;
    appleImagesLoaded.push(image);
});

let snake = [];
let score = 0;
let tolikModeEnabled = true;
let snakeSpeed;
export let gameLoopTimeout;

const maxObstacles = 20; // Максимальное число препятствий
let obstacles = [];

function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        resetGame();
    } else {
        if (apples.length > 0 && Math.abs(snake[0].x - apples[0].x) <= 1 && Math.abs(snake[0].y - apples[0].y) <= 1) {
            score++;
            addSnakeSegment();
            apples.shift();
            placeFood();
            increaseSpeed();
            // Создаем 3 препятствия за каждое съеденное яблоко
            for (let i = 0; i < 3; i++) {
                if (obstacles.length < maxObstacles) {
                    placeObstacle();
                }
            }
        }
        drawEverything();
        gameLoopTimeout = setTimeout(gameLoop, snakeSpeed);
    }
}

function moveSnake() {
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = { ...snake[i - 1] };
    }
    snake[0].x += direction.x;
    snake[0].y += direction.y;
}

function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    for (let i = 0; i < obstacles.length; i++) {
        if (snake[0].x === obstacles[i].x && snake[0].y === obstacles[i].y) {
            return true;
        }
    }
    // Проверяем столкновение с яблоком
    for (let i = 0; i < apples.length; i++) {
        if (snake[0].x === apples[i].x && snake[0].y === apples[i].y) {
            return true;
        }
    }
    return false;
}

function placeFood() {
    const x = Math.floor(Math.random() * tileCount / 2) * 2;
    const y = Math.floor(Math.random() * tileCount / 2) * 2;
    const imageIndex = Math.floor(Math.random() * appleImagesLoaded.length);
    apples.push({ x, y, imageIndex });
}

function placeObstacle() {
    const x = Math.floor(Math.random() * tileCount);
    const y = Math.floor(Math.random() * tileCount);
    const obstacleImage = new Image();
    // Задаем текстуру для препятствия
    obstacleImage.src = 'img/k1.png'; // Замените путь на путь к вашей текстуре
    obstacles.push({ x, y, obstacleImage });
}

function addSnakeSegment() {
    const lastSegment = snake[snake.length - 1];
    snake.push({ x: lastSegment.x, y: lastSegment.y });
}

function drawEverything() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка яблок
    apples.forEach(apple => {
        ctx.drawImage(
            appleImagesLoaded[apple.imageIndex],
            apple.x * 20,
            apple.y * 20,
            gridSize * 2,
            gridSize * 2
        );
    });

    // Отрисовка препятствий
    obstacles.forEach(obstacle => {
        // Используем текстуру для препятствия
        ctx.drawImage(
            obstacle.obstacleImage,
            obstacle.x * 20,
            obstacle.y * 20,
            gridSize * 2,
            gridSize * 2  // Удваиваем высоту, чтобы препятствие было размером 1 на 2 клетки
        );
    });

    // Отрисовка змейки
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        let imageToDraw = snakeBodyImage;
        if (i === 0) {
            imageToDraw = snakeHeadImage;
        }
        ctx.drawImage(
            imageToDraw,
            segment.x * 20,
            segment.y * 20,
            gridSize * 2,
            gridSize * 2
        );
    }

    // Отрисовка счета
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 10);

    // Включение режима Толика при достижении 22 очков
    if (tolikModeEnabled && score >= 22) {
        document.body.classList.add('tolik-active');
    } else {
        document.body.classList.remove('tolik-active');
    }
}

// Сброс игры
function resetGame() {
    snake = [{
        x: Math.floor((Math.random() * tileCount) / 2) * 2,
        y: Math.floor((Math.random() * tileCount) / 2) * 2
    }];
    direction = { x: 0, y: 0 };
    score = 0;
    apples = [];
    obstacles = []; // Сбрасываем препятствия
    placeFood(); // Размещаем новое яблоко
    document.body.classList.remove('tolik-active');
    snakeSpeed = 150;
    clearTimeout(gameLoopTimeout);
}

// Увеличение скорости игры
function increaseSpeed() {
    snakeSpeed = Math.max(20, snakeSpeed - 2); // Уменьшаем интервал на 2 мс, минимальная скорость - 20 мс
}

// Переключение режима Толика
function toggleTolikMode() {
    tolikModeEnabled = !tolikModeEnabled;
    const button = document.getElementById('tolikModeButton');
    button.textContent = tolikModeEnabled ? 'Режим Толика ВКЛ' : 'Режим Толика ВЫКЛ';
}

document.addEventListener("keydown", eventListener);

resetGame();
gameLoop();