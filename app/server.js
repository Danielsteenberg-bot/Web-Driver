const express = require('express');
const session = require('cookie-session');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketIO = require('socket.io');
const { test } = require('./classes/session');
const io = socketIO(server)
require('dotenv').config();


//session setup
const sessions = session({
    secret: 'ekweori324ijfg230',
    resave: false,
    saveUninitialized: true
});

app.use(sessions);
io.engine.use(sessions)

app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routers
app.use('/', require('./routes/account'))
app.use('/dashboard', require('./routes/home'))


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

io.on('connection', (socket) => {
    const users = {};

    socket.on('join-room', (data) => {
        const { roomId } = data;
        userId = socket.request.session.userId

        // Update the user's socket ID or add a new user to the room
        if (!users[roomId]) {
            users[roomId] = {};
        }

        users[roomId][userId] = { socketId: socket.id };

        // Log the updated users information
        console.log(users);

        // Join the room
        socket.join(roomId);

        // Emit a message to the user who just joined the room
        socket.emit('joined-message', `Welcome to user ${userId} to room ${roomId}`);

        // Emit a message to all users in the room except the newly joined user
        socket.to(roomId).emit('joined-message', `${userId} has joined the room`);

    });

    const directions = ['left', 'right', 'up', 'down'];

    directions.forEach(direction => {
        socket.on(direction, async (data) => {
            const { direction, roomId } = data;
            const id = socket.request.session.userId

            const session = await test(id, direction);
            console.log(session);
        });
    });

});
