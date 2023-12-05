const socket = io()
let roomId = "1"
const btns = document.querySelectorAll('.movement')
let isHolding = false;
let holdTimeout;

btns.forEach(btn => {
    btn.addEventListener('mousedown', () => {
        // console.log(btn);
        isHolding = true;
        holdTimeout = setInterval(() => {
            
            if(isHolding){
                const classes = btn.classList
                const direction = Array.from(classes).find(cls => cls !== 'movement');
        
                socket.emit(direction, {direction, roomId})
            }
        }, 200)
    })
    btn.addEventListener('mouseup', () => {
        isHolding = false;
        clearTimeout(holdTimeout);
    });
});
document.addEventListener('DOMContentLoaded', (event) => {
    socket.emit('join-room', {userId, roomId})
})

socket.on('joined-message', (data) => {
    const message = data
    console.log(message);
})
// console.log(`id: ${userId}`);
// socket.emit('join-room', (userId))