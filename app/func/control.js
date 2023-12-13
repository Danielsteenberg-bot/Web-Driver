const { post } = require("../routes/account");

const socket = io();
let deviceId = "1";
const btns = document.querySelectorAll('.movement');
let isHolding = false;
let holdTimeout;

socket.on("move", (direction) => {
    console.log(direction)
})

document.addEventListener('DOMContentLoaded', (event) => {
    socket.emit('join-room-user', { deviceId });
    socket.emit('join-room-device', { pass: "test", deviceId });
});


socket.on('joined-message', (data) => {
    const message = data;
    console.log(message);
});


btns.forEach(btn => {
    btn.addEventListener('mousedown', () => {
        isHolding = true;
        holdTimeout = setTimeout(function holdInterval() {
            if (isHolding) {
                emitDirection(btn);
                holdTimeout = setTimeout(holdInterval, 200);
            }
        }, 200);
    });

    btn.addEventListener('mouseup', () => {
        isHolding = false;
        clearTimeout(holdTimeout);
    });
});

function emitDirection(btn) {
    const classes = btn.classList;
    const direction = Array.from(classes).find(cls => cls !== 'movement');

    socket.emit("move", direction);


}
    let longLat = []; 

    socket.on('gps', async (lat, long) => {
        const session = await test(userId, lat, long);
        longLat.push({lat, long});
    });

    setInterval(async() => {
        const session = await prisma.user.update({
            where: { id: userId },
            data: {
                longLat
            }
        });
        post(longLat);
    }, 10000);
    
    let sonar = [];

    socket.on('sonar', async (front, left, right) => {
        const session = await test(userId, front, left, right);
        sonar.push({front, left, right});
    });

    setInterval(async() => {
        const session = await prisma.user.update({
            where: { id: userId },
            data: {
                sonar
            }
        });
        post(sonar);
    }, 10000);


    let rotation = [];

    socket.on('rotation', async (angle) => {
        const session = await test(userId, angle);
        rotation.push(angle);
    });
    
    setInterval(async() => {
        const session = await prisma.user.update({
            where: { id: userId },
            data: {
                rotation
            }
        });
        post(rotation);
    }, 10000);