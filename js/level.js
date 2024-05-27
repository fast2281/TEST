const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

const snakeHeadImage = new Image();
snakeHeadImage.src = 'img/z1.jpg';

const snakeTailImage = new Image();
snakeTailImage.src = 'img/z2.jpg';

const snakeBodyImage = new Image();
snakeBodyImage.src = 'img/z3.jpg';

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
let direction = {};
let score = 0;
let tolikModeEnabled = true;
let snakeSpeed = 150;
let gameLoopTimeout;
let pause = false;

function gameLoop() {
    if (pause) return;
    moveSnake();
    if (checkCollision()) {
        resetGame();
        gameLoop();
    } else {
        if (snake[0].x === apples[0].x && snake[0].y === apples[0].y) {
            score++;
            addSnakeSegment();
            apples.shift();
            placeFood();
            increaseSpeed();
        }
        drawEverything();
        gameLoopTimeout = setTimeout(gameLoop, snakeSpeed);
    }
}

function moveSnake() {
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = { ...snake[i - 1] };
    }
    snake[0].x += direction.x * 2;
    snake[0].y += direction.y * 2;
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
    const x = Math.floor(Math.random() * tileCount / 2) * 2;
    const y = Math.floor(Math.random() * tileCount / 2) * 2;
    const imageIndex = Math.floor(Math.random() * appleImagesLoaded.length);
    apples.push({ x, y, imageIndex });
}

function addSnakeSegment() {
    const lastSegment = snake[snake.length - 1];
    snake.push({ x: lastSegment.x, y: lastSegment.y });
}

function drawEverything() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    apples.forEach(apple => {
        ctx.drawImage(
            appleImagesLoaded[apple.imageIndex],
            apple.x * 20,
            apple.y * 20,
            gridSize * 2,
            gridSize * 2
        );
    });

    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        let imageToDraw = snakeBodyImage;
        if (i === 0) {
            imageToDraw = snakeHeadImage;
        }
        else if (i === snake.length - 1) {
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

    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 10);

    if (tolikModeEnabled && score >= 22) {
        document.body.classList.add('tolik-active');
    } else {
        document.body.classList.remove('tolik-active');
    }
}

function resetGame() {
    snake = [{ x: Math.floor((Math.random() * tileCount) / 2) * 2, y: Math.floor((Math.random() * tileCount) / 2) * 2 }];
    direction = { x: 0, y: 0 };
    score = 0;
    apples = [];
    placeFood();
    document.body.classList.remove('tolik-active');
    snakeSpeed = 100;
    clearTimeout(gameLoopTimeout);
}

function increaseSpeed() {
    snakeSpeed = Math.max(20, snakeSpeed - 2); // Уменьшаем интервал на 2 мс, минимальная скорость - 20 мс
}

function toggleTolikMode() {
    tolikModeEnabled = !tolikModeEnabled;
    const button = document.getElementById('tolikModeButton');
    button.textContent = tolikModeEnabled ? 'Режим Толика ВКЛ' : 'Режим Толика ВЫКЛ';
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
        case "ц":
        case "Ц":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
        case "s":
        case "S":
        case "ы":
        case "Ы":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
        case "a":
        case "A":
        case "ф":
        case "Ф":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
        case "d":
        case "D":
        case "в":
        case "В":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
        case " ":
            pause = !pause;
            if (!pause) {
                gameLoop();
            } else {
                clearInterval(gameInterval);
            }
            break;
    }
});

resetGame();
gameLoop();