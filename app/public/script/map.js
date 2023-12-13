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

let userId = [];

let start = {
    x: canvas.width / 2,
    y: canvas.height / 2,
};

let cp1 = { x: 0, y: 0 };
let cp2 = { x: 0, y: 0 };
let end = { x: 0, y: 0 };


const ball = {
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
    // trail.push({ x: ball.x, y: ball.y - i * 2 });
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < trail.length; i++) {
        // trail[i].y += bal    l.speed;
    }

    trail.push({ x: ball.x, y: ball.y });

    if (trail.length > 50) {
        trail.length = 35;
    }

    for (let i = trail.length - 1; i >= 0; i--) {
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();

    requestAnimationFrame(draw);
}

// R L F B
// document.addEventListener('keydown', (event) => {
//     switch (event.key) {
//         case 'ArrowUp':
//             distance++;
//             ball.speed = 7;
//             ball.dy = -ball.speed;
//             socket.emit('move', "F")
//             break;

//         case 'ArrowDown':
//             distance++;  
//             ball.speed = 3;
//             ball.dy = ball.speed;
//             socket.emit('move', "B")

//             break;

//         case 'ArrowLeft':
//             distance++;
//             ball.speed = 6;
//             ball.dx = -ball.speed;
//             socket.emit('move', "L")
//             break;
//         case 'ArrowRight':
//             distance++;
//             ball.speed = 6;
//             ball.dx = ball.speed;
//             socket.emit('move', "R")
//             break;
//     }
// });

// document.addEventListener('keyup', (event) => {
//     ball.speed = 5;
//     switch (event.key) {
//         case 'ArrowUp':
//         case 'ArrowDown':
//             ball.dy = 0;
//         break;

//         case 'ArrowLeft':
//         case 'ArrowRight':
//             ball.dx = 0;
//         break;
//     }
// });
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
            case 'ArrowUp':
                // console.log("F");
                checkActive(0)
                combination += 'F'
                break;

            case 'ArrowLeft':
                // console.log("L");
                checkActive(1);
                combination += 'L'
                break;

            case 'ArrowDown':
                // console.log("B");
                checkActive(2)
                combination += 'B'
                break;

            case 'ArrowRight':
                // console.log("R");
                checkActive(3)
                combination += 'R'
                break;
            case 'w':
                // console.log("F");
                checkActive(0)
                combination += 'F'
                break;

            case 'a':
                // console.log("L");
                checkActive(1)
                combination += 'L'
                break;

            case 's':
                // console.log("B");
                checkActive(2)
                combination += 'B'
                break;

            case 'd':
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
    ball.x += ball.dx;
    ball.y += ball.dy;
    // console.log(`ball.x: ${ball.x += ball.dx} ball.y: ${ball.y} `)
    // console.log(ball.dy);


}

function drawRoute() {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineWidth = 10;

    if (Math.floor(distance) % 1 === 0) {
        checkpoints.push({ x: ball.x, y: ball.y });
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
    infoSpeed.innerHTML = `${ball.speed}m/s`;
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
            x: ball.x,
            y: ball.y,
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
            x: ball.x,
            y: ball.y,
        };
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        checkpoints = [];
        clicked = false;
    }
});

// let longLat = []; 

// socket.on('gps', async (lat, long) => {
//     const session = await test(userId, lat, long);
//     longLat.push({lat, long});
// });

// setInterval(async() => {
//     const session = await prisma.user.update({
//         where: { id: userId },
//         data: {
//             longLat
//         }
//     });
//     post(longLat);
// }, 10000);

// let sonar = [];

// socket.on('sonar', async (front, left, right) => {
//     const session = await test(userId, front, left, right);
//     sonar.push({front, left, right});
// });

// setInterval(async() => {
//     const session = await prisma.user.update({
//         where: { id: userId },
//         data: {
//             sonar
//         }
//     });
//     post(sonar);
// }, 10000);


let rotation = [];

socket.on('rotation', async (angle) => {
    const session = await data(userId,angle);
    rotation.push(angle);
    console.log("successful socket")
});

setInterval(async() => {
    const session = await prisma.user.findFirst({
        where: { id: userId },
        data: {
            rotation
        }
    });
    post(rotation);
    console.log("successful post");
}, 10000);

data();


