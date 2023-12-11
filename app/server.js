const express = require('express');
const session = require('express-session');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketIO = require('socket.io');
const { test } = require('./classes/session');
const { on } = require('events');
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
    let user = socket.request.session.userId
    if (user) {
        socket.on('join-room-user', (data) => {
            const { deviceId } = data;
            socket.emit('gps', 51.505, -0.09);
            userId = socket.request.session.userId
            
            // Update the user's socket ID or add a new user to the room
            if (!users[deviceId]) {
                users[deviceId] = {};
            }

            users[deviceId][userId] = { socketId: socket.id };

            // Log the updated users information
            console.log(users);

            // Join the room
            socket.join(deviceId);

            // Emit a message to the user who just joined the room
            socket.emit('joined-message', `Welcome to user ${userId} to deviceId: ${deviceId}`);
            
            // Emit a message to all users in the room except the newly joined user
            socket.to(deviceId).emit('joined-message', `${userId} has joined the room`);

            socket.on("move", (direction) => {
                console.log("client" + direction)
                socket.to(deviceId).emit("move", direction)
            })
        });
    }
    else if(!user){
        socket.on('join-room-device', (data) => {
            const { pass, deviceId } = data
            if(pass == process.env.DEVICE_PASS){
                socket.join(deviceId)
                socket.emit('joined-message', `Welcome to ${pass} to deviceId: ${deviceId}`);
            }}
            )
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
                handleRotation,
                handleSonar,
                handleGPS
            }
        

    const directions = ['left', 'right', 'up', 'down'];

    directions.forEach(direction => {
        socket.on(direction, async (data) => {
            const { direction, deviceId } = data;
            const id = socket.request.session.userId

            
            console.log(direction);
            // const session = await test(id, direction);
            // console.log(session);
        });
    });
};
});

