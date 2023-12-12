const canvas = document.querySelector('.canvasMap');
const ctx = canvas.getContext('2d');
const infoSpeed = document.querySelector('.infoSpeed');
const infoDist = document.querySelector('.infoDist');
const clearBTN = document.querySelector('.clearBTN');
const saveBTN = document.querySelector('.saveBTN');
const arrowKeys = document.querySelectorAll('.arrow-key');

let distance = 0;
let checkpoints = [];
let drivesession = [];

let rotation = 0;
let sonar = [0, 0, 0];

socket.on("rotation", (_rotation) => { rotation = _rotation; console.log(_rotation) })
socket.on("sonar", (f, l, r) => { sonar = [f, l, r]; })

let start = {
    x: canvas.width / 2,
    y: canvas.height / 2,
};

let cp1 = { x: 0, y: 0 };
let cp2 = { x: 0, y: 0 };
let end = { x: 0, y: 0 };

const car = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    color: '#EEEEEE',
    speed: 5,
    dx: 0,
    dy: 0
};

const trail = [];
for (let i = 0; i < 30; i++) {
    trail.push({ x: car.x, y: car.y - i * 2 });
}

// Function to calculate rotated points
function rotatePoint(x, y, centerX, centerY, angle) {
    const rad = angle * Math.PI / 180;
    const rotatedX = Math.cos(rad) * (x - centerX) - Math.sin(rad) * (y - centerY) + centerX;
    const rotatedY = Math.sin(rad) * (x - centerX) + Math.cos(rad) * (y - centerY) + centerY;
    return [ rotatedX, rotatedY ];
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

    for (let i = 0; i < trail.length; i++) {
        trail[i].y += car.speed;
    }

    trail.push({ x: car.x, y: car.y });

    if (trail.length > 50) {
        trail.length = 35;
    }

    for (let i = trail.length - 1; i >= 0; i--) {
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, car.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();
    }

    drawTriangle(ctx, car.x, car.y, 30, 360 - rotation);

    requestAnimationFrame(draw);
}

const pressedKeys = {}
onkeydown = (event) => {
    pressedKeys[event.key] = true;
    HandleKeyDown()
}
onkeyup = (event) => {
    delete pressedKeys[event.key]
    removeActive()
    HandleKeyDown()
}

function HandleKeyDown() {
    const keys = Object.keys(pressedKeys)
    let combination = ''

    keys.forEach(key => {
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
    })

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
function updateBallPosition() {
    car.x += car.dx;
    car.y += car.dy;
    // console.log(`ball.x: ${ball.x += ball.dx} ball.y: ${ball.y} `)
    // console.log(ball.dy);


}

function drawRoute() {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineWidth = 10;

    if (Math.floor(distance) % 1 === 0) {
        checkpoints.push({ x: car.x, y: car.y });
    }

    for (let i = 0; i < checkpoints.length; i++) {
        ctx.lineTo(checkpoints[i].x, checkpoints[i].y);
    }

    ctx.stroke();
}

function update() {
    updateBallPosition();
    draw();
    drawRoute();
    requestAnimationFrame(update);
    infoSpeed.innerHTML = `${car.speed}m/s`;
    infoDist.innerHTML = `${distance}m`;
}


saveBTN.addEventListener('click', () => {
    clicked = true;
    drivesession.push({
        distance: distance,
        checkpoints: checkpoints,
    });

    if (clicked == true) {
        start = {
            x: car.x,
            y: car.y,
        };
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        checkpoints = [];
        clicked = false;
    }
});


clearBTN.addEventListener('click', () => {
    // console.log(checkpoints)
    clicked = true;
    distance = 0;
    if (clicked == true) {
        start = {
            x: car.x,
            y: car.y,
        };
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        checkpoints = [];
        clicked = false;
    }
});


update();


