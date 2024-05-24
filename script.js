const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Загрузка изображений для змейки и яблок
const snakeHeadImage = new Image();
snakeHeadImage.src = 'img/z1.jpg';

const snakeBodyImage = new Image();
snakeBodyImage.src = 'img/z2.jpg';

const appleImages = [
    'img/ap.png',
    'img/ap2.jpg',
    'img/ap3.jpg',
    'img/ap4.jpg',
    'img/ap5.jpg',
    'img/ap6.jpg'
];

// Массив для хранения координат яблок
let apples = [];

// Загрузка изображений яблок
const appleImagesLoaded = [];
appleImages.forEach(src => {
    const image = new Image();
    image.src = src;
    appleImagesLoaded.push(image);
});

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let score = 0;
let tolikModeEnabled = true; // Флаг для отслеживания состояния режима Толика

function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        resetGame();
        gameLoop();
    } else {
        if(Math.abs(snake[0].x - apples[0].x) <= 1 && Math.abs(snake[0].y - apples[0].y) <= 1) {
            score++;
            addSnakeSegment();
            apples.shift(); // Убираем съеденное яблоко из массива яблок
            placeFood(); // После съедания добавляем новое яблоко
        }
        drawEverything();
        setTimeout(gameLoop, 80-score);
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
    return false;
}

function placeFood() {
    // Генерация случайных координат для яблока
    const x = Math.floor(Math.random() * tileCount / 2) * 2;
    const y = Math.floor(Math.random() * tileCount / 2) * 2;
    // Выбор случайного изображения для яблока
    const imageIndex = Math.floor(Math.random() * appleImagesLoaded.length);
    // Добавление яблока в массив яблок
    apples.push({ x, y, imageIndex });
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

    // Если режим Толика включен и набрано 22 очка, отображаем картинку на заднем фоне
    if (tolikModeEnabled && score >= 22) { ///////////////////////
        document.body.classList.add('tolik-active');
    } else {
        document.body.classList.remove('tolik-active');
    }

}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    apples = [];
    placeFood();
    document.body.classList.remove('tolik-active'); // Скрываем изображение Толика при сбросе игры
}

function toggleTolikMode() {
    tolikModeEnabled = !tolikModeEnabled;
    const button = document.getElementById('tolikModeButton');
    button.textContent = tolikModeEnabled ? 'Режим Толика ВКЛ' : 'Режим Толика ВЫКЛ';
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

resetGame();
gameLoop();
