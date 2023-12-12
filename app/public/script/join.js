const socket = io();
const deviceId = "1";

document.addEventListener('DOMContentLoaded', (event) => {
    socket.emit('join-room-user', { deviceId });
    socket.emit('join-room-device', { pass: "test", deviceId });
});

socket.on('joined-message', (data) => {
    const message = data;
    console.log(message);
});
