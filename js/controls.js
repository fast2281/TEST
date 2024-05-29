export let pause = false;
export let direction = { x: 0, y: 0 }
import { gameLoop, gameLoopTimeout } from "./lv0.js";
export function resetDirection() {
    direction.x = 0;
    direction.y = 0;
}
function eventListener(event) {
    switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
        case "ц":
        case "Ц":
            if (direction.y === 0) {
                direction.x = 0;
                direction.y = -1;
            };
            break;
        case "ArrowDown":
        case "s":
        case "S":
        case "ы":
        case "Ы":
            if (direction.y === 0) {
                direction.x = 0;
                direction.y = 1;
            };
            break;
        case "ArrowLeft":
        case "a":
        case "A":
        case "ф":
        case "Ф":
            if (direction.x === 0) {
                direction.x = -1;
                direction.y = 0;
            };
            break;
        case "ArrowRight":
        case "d":
        case "D":
        case "в":
        case "В":
            if (direction.x === 0) {
                direction.x = 1;
                direction.y = 0;
            };
            break;
        case " ":
            pause = !pause;
            if (!pause) {
                gameLoop();
            } else {
                clearTimeout(gameLoopTimeout);
            }
            break;
        case "Escape":
            history.back();
            break;
        default:
            console.log(`Key pressed: ${event.key}`);
    }
};

=======
export let pause = false;
export let direction = { x: 0, y: 0 }
import { gameLoop, gameLoopTimeout } from "./lv0.js";
export function resetDirection() {
    direction.x = 0;
    direction.y = 0;
}
function eventListener(event) {
    switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
        case "ц":
        case "Ц":
            if (direction.y === 0) {
                direction.x = 0;
                direction.y = -1;
            };
            break;
        case "ArrowDown":
        case "s":
        case "S":
        case "ы":
        case "Ы":
            if (direction.y === 0) {
                direction.x = 0;
                direction.y = 1;
            };
            break;
        case "ArrowLeft":
        case "a":
        case "A":
        case "ф":
        case "Ф":
            if (direction.x === 0) {
                direction.x = -1;
                direction.y = 0;
            };
            break;
        case "ArrowRight":
        case "d":
        case "D":
        case "в":
        case "В":
            if (direction.x === 0) {
                direction.x = 1;
                direction.y = 0;
            };
            break;
        case " ":
            pause = !pause;
            if (!pause) {
                gameLoop();
            } else {
                clearTimeout(gameLoopTimeout);
            }
            break;
        case "Escape":
            history.back();
            break;
        default:
            console.log(`Key pressed: ${event.key}`);
    }
};

export { eventListener }