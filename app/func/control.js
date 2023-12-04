const socket = io()

document.addEventListener('DOMContentLoaded', (event) => {
    socket.emit('join-room', (userId))
})
// console.log(`id: ${userId}`);
// socket.emit('join-room', (userId))