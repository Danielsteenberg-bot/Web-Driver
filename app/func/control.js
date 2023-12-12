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

function handleGPS(socket, userId, test, prisma) {
    socket.on('gps', async (lat, long) => {
        const session = await test(userId, lat, long);
        const latLong = await prisma.user.update({
            where: { id: userId },
            data: {
                lat,
                long                       
            }
        });
    });
};

function handleSonar(socket, userId, test, prisma) {
    socket.on('sonar', async (front, left, right) => {
        const session = await test(userId, front, left, right);
        const sonar = await prisma.user.update({
            where: { id: userId },
            data: {
                front,
                left,
                right
            }
        });
    });
};

function handleRotation(socket, userId, test, prisma) {
    socket.on('rotation', async (angle) => {
        console.log('rotation');
        const session = await test(userId, angle);
        const rotation = await prisma.user.update({
            where: { id: userId },
            data: {
                angle
            }
        });
    });
};

module.exports = {
    handleGPS,
    handleSonar,
    handleRotation
};