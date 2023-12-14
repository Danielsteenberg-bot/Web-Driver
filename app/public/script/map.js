const canvas = document.querySelector('.canvasMap');
const infoSpeed = document.querySelector('.infoSpeed');
const infoDist = document.querySelector('.infoDist');
const clearBTN = document.querySelector('.clearBTN');
const saveBTN = document.querySelector('.saveBTN');
const arrowKeys = document.querySelectorAll('.arrow-key');
const ctx = canvas.getContext('2d');

let distance = 0;
let rotation = 0;
let sonar_front = 0;
let sonar_left = 0;
let sonar_right = 0;

socket.on("rotation", (_rotation) => { rotation = 360 - _rotation; })
socket.on("sonar", (front, left, right) => { 
    sonar_front = front;
    sonar_left = left;
    sonar_right = right;
})

let start = {
    x: canvas.width / 2,
    y: canvas.height / 2,
};

const car = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: 0,
};

// Function to calculate rotated points
function rotatePoint(x, y, centerX, centerY, angle) {
    const rad = angle * Math.PI / 180;
    const rotatedX = Math.cos(rad) * (x - centerX) - Math.sin(rad) * (y - centerY) + centerX;
    const rotatedY = Math.sin(rad) * (x - centerX) + Math.cos(rad) * (y - centerY) + centerY;
    return [ rotatedX, rotatedY ];
}

function drawFront(ctx, distance, rotation) {
    if (distance == 0) {
        return
    }

    ctx.beginPath();
    ctx.lineWidth = 5;

    let p1 = rotatePoint(car.x-15, car.y - distance - 40, car.x, car.y, rotation)
    let p2 = rotatePoint(car.x+15, car.y - distance - 40, car.x, car.y, rotation)

    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);

    ctx.closePath();
    ctx.stroke();
}

function drawRight(ctx, distance, rotation) {
    if (distance == 0) {
        return
    }

    ctx.beginPath();
    ctx.lineWidth = 5;

    let p1 = rotatePoint(car.x + 25 + distance, car.y - 30, car.x, car.y, rotation)
    let p2 = rotatePoint(car.x + 25 + distance, car.y, car.x, car.y, rotation)

    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);

    ctx.closePath();
    ctx.stroke();
}

function drawLeft(ctx, distance, rotation) {
    if (distance == 0) {
        return
    }

    ctx.beginPath();
    ctx.lineWidth = 5;

    let p1 = rotatePoint(car.x - 25 - distance, car.y - 30, car.x, car.y, rotation)
    let p2 = rotatePoint(car.x - 25 - distance, car.y, car.x, car.y, rotation)

    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);

    ctx.closePath();
    ctx.stroke();
}

// Reusable function to draw the triangle
function drawTriangle(ctx, x, y, size, angle) {
    
    // Calculate rotated vertices
    const top = rotatePoint(x, y - size, x, y, angle);
    const bottomLeft = rotatePoint(x - size / 2, y + size / 2, x, y, angle);
    const bottomRight = rotatePoint(x + size / 2, y + size / 2, x, y, angle);

    ctx.beginPath();
    
    ctx.lineWidth = 5;

    ctx.moveTo(top[0], top[1]);
    ctx.lineTo(bottomLeft[0], bottomLeft[1]);
    ctx.lineTo(bottomRight[0], bottomRight[1]);
    
    ctx.fillStyle = 'rgba(255, 255, 255)';
    ctx.fill();

    ctx.closePath();
    ctx.stroke();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
 
    drawTriangle(ctx, car.x, car.y, 30, rotation);

    drawFront(ctx, sonar_front, rotation)
    drawLeft(ctx, sonar_left, rotation)
    drawRight(ctx, sonar_right, rotation)

    requestAnimationFrame(draw);
}

const keys = {}

const directionToMovement = {
    'up': 'F',
    'down': 'B',
    'left': 'L',
    'right': 'R',
}

arrowKeys.forEach(key => {
    let mouseTimer

    key.addEventListener('mousedown', () => {
        const direction = key.dataset.direction;
        // Check if the direction is valid
        if (directionToMovement.hasOwnProperty(direction)) {
            mouseTimer = setInterval(() => {
                socket.emit('move', directionToMovement[direction]);
            }, 10);
        }
    });

    key.addEventListener('mouseup', () => {
        clearInterval(mouseTimer);
    });

    key.addEventListener('mouseleave', () => {
        // Clear the interval when the mouse leaves the document
        clearInterval(mouseTimer);
        removeActive()
    });
    
})

const pressedKeys = {}
onkeydown = (event) => {
    keys[event.key] = true;
}
onkeyup = (event) => {
    keys[event.key] = false;
    removeActive();
}

function handle_keys() {
    let combination = ""

    Object.keys(keys).forEach(key => {
        
        if (!keys[key]) return;

        switch (key) {
            case 'ArrowUp', 'w':
                // console.log("F");
                checkActive(0)
                combination += 'F'
                break;

            case 'ArrowLeft', 'a':
                // console.log("L");
                checkActive(1);
                combination += 'L'
                break;

            case 'ArrowDown', 's':
                // console.log("B");
                checkActive(2)
                combination += 'B'
                break;

            case 'ArrowRight', 'd':
                // console.log("R");
                checkActive(3)
                combination += 'R'
                break;
        }

        sendMove(combination)
    })
}

async function sendMove(combination) {
    if (combination.length > 0) {
        const set = new Set(combination.split(''))
        const filteredCombination = [...set].join('')
        socket.emit('move', filteredCombination)
    }
}

function removeActive() {
    arrowKeys[0].classList.remove("active");
    arrowKeys[1].classList.remove("active");
    arrowKeys[2].classList.remove("active");
    arrowKeys[3].classList.remove("active");
}

function checkActive(key) {
    if (!arrowKeys[key].classList.contains('active')) {
        arrowKeys[key].classList.toggle("active");
    }
}

function update() {
    draw();
    infoSpeed.innerHTML = `${car.speed}m/s`;
    infoDist.innerHTML = `${distance}m`;
    requestAnimationFrame(update);
    handle_keys();
}

update();