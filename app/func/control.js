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