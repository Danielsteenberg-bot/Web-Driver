const canvas = document.querySelector('.canvasMap');
const ctx = canvas.getContext('2d');

let distance = 0;
let rotation = 0;
let sonar_front = 0;
let sonar_left = 0;
let sonar_right = 0;

// socket.on("rotation", (_rotation) => { rotation = 360 - _rotation; })
// socket.on("sonar", (front, left, right) => { 
//     sonar_front = front;
//     sonar_left = left;
//     sonar_right = right;
// })

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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
 
    drawTriangle(ctx, car.x, car.y, 30, rotation);

    drawFront(ctx, sonar_front, rotation)
    drawLeft(ctx, sonar_left, rotation)
    drawRight(ctx, sonar_right, rotation)
}

document.addEventListener('DOMContentLoaded', function () {
    // Create a new EventSource instance pointing to the SSE endpoint
    var eventSource = new EventSource('/history/' + history_id);

    eventSource.onmessage = function (event) {
        // Parse the JSON data
        var data = JSON.parse(event.data);
        rotation = data.rotation;
        sonar_front = data.sonar_forward;
        sonar_left = data.sonar_left;
        sonar_right = data.sonar_right;
        draw();
    };

    eventSource.onerror = function (error) {
        console.error('History failed:', error);
        eventSource.close();
    };

    eventSource.onopen = function () {
        console.log('History stream started');
    };
});