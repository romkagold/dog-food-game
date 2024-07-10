const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size to 9:16 aspect ratio or fit the screen
const aspectRatio = 9 / 16;
const screenAspectRatio = window.innerWidth / window.innerHeight;
if (screenAspectRatio > aspectRatio) {
    canvas.height = window.innerHeight;
    canvas.width = canvas.height * aspectRatio;
} else {
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / aspectRatio;
}

const dog = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    size: 50,
    dx: 0,
    speed: 5,
    lives: 6,
    score: 0
};

const foods = [];
const allowedFoods = [
    { emoji: '🍏', label: 'apple', color: 'green' },
    { emoji: '🥕', label: 'carrot', color: 'orange' },
    { emoji: '🍗', label: 'chicken', color: 'yellow' },
    { emoji: '🎃', label: 'pumpkin', color: 'orange' },
    { emoji: '🍃', label: 'green beans', color: 'green' },
    { emoji: '🍠', label: 'sweet potato', color: 'orange' },
    { emoji: '🥜', label: 'peanut butter', color: 'brown' },
    { emoji: '🍦', label: 'yogurt', color: 'white' },
    { emoji: '🍚', label: 'rice', color: 'white' },
    { emoji: '🧀', label: 'cheese', color: 'yellow' },
    { emoji: '🥚', label: 'eggs', color: 'yellow' },
    { emoji: '🍞', label: 'bread', color: 'wheat' },
    { emoji: '🍗', label: 'turkey', color: 'lightbrown' }
];
const forbiddenFoods = [
    { emoji: '🍫', label: 'chocolate', color: 'brown' },
    { emoji: '🍇', label: 'grape', color: 'purple' },
    { emoji: '🧅', label: 'onion', color: 'white' },
    { emoji: '🍇', label: 'raisins', color: 'purple' },
    { emoji: '🧄', label: 'garlic', color: 'white' },
    { emoji: '🥑', label: 'avocado', color: 'green' },
    { emoji: '🍷', label: 'alcohol', color: 'red' },
    { emoji: '☕', label: 'caffeine', color: 'black' },
    { emoji: '🌰', label: 'macadamia nuts', color: 'brown' },
    { emoji: '🍬', label: 'xylitol', color: 'white' },
    { emoji: '🥖', label: 'yeast dough', color: 'wheat' },
    { emoji: '🍟', label: 'fatty foods', color: 'gray' },
    { emoji: '🥛', label: 'milk', color: 'white' },
    { emoji: '🧂', label: 'salt', color: 'white' },
    { emoji: '🌽', label: 'corn', color: 'yellow' }
];

function createFood() {
    const foodList = Math.random() > 0.5 ? allowedFoods : forbiddenFoods;
    const food = foodList[Math.floor(Math.random() * foodList.length)];
    const x = Math.random() * (canvas.width - 30);
    foods.push({ x, y: 0, ...food });
}

function drawDog() {
    ctx.font = `${dog.size}px Arial`;
    ctx.fillText('🐕', dog.x, dog.y + dog.size);
}

function drawFood(food) {
    if (food.emoji) {
        ctx.font = '30px Arial';
        ctx.fillText(food.emoji, food.x, food.y + 30);
    } else {
        ctx.fillStyle = food.color;
        ctx.fillRect(food.x, food.y, 30, 30);
        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        ctx.fillText(food.label, food.x, food.y + 20, 30);
    }
}

function moveDog() {
    dog.x += dog.dx;
    if (dog.x < 0) dog.x = 0;
    if (dog.x + dog.size > canvas.width) dog.x = canvas.width - dog.size;
}

function moveFoods() {
    foods.forEach(food => {
        food.y += 2;
    });
}

function checkCollision() {
    foods.forEach((food, index) => {
        if (food.y + 30 > dog.y && food.y < dog.y + dog.size && food.x + 30 > dog.x && food.x < dog.x + dog.size) {
            if (allowedFoods.some(f => f.label === food.label)) {
                dog.score += 10;
            } else {
                dog.lives -= 1;
                if (dog.lives <= 0) {
                    alert('Game Over! Your score: ' + dog.score);
                    document.location.reload();
                }
            }
            foods.splice(index, 1);
        }
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + dog.score, 20, 30);
}

function drawLives() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Lives: ' + dog.lives, 20, 60);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveDog();
    moveFoods();
    checkCollision();
    drawDog();
    foods.forEach(drawFood);
    drawScore();
    drawLives();

    requestAnimationFrame(update);
}

function handleKeyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        dog.dx = dog.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        dog.dx = -dog.speed;
    }
}

function handleKeyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'ArrowLeft' || e.key === 'a') {
        dog.dx = 0;
    }
}

function handleTouchStart(e) {
    const touchX = e.touches[0].clientX;
    if (touchX < canvas.width / 2) {
        dog.dx = -dog.speed;
    } else {
        dog.dx = dog.speed;
    }
}

function handleTouchEnd(e) {
    dog.dx = 0;
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);

setInterval(createFood, 1000);
update();
