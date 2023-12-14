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
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const { post } = ('');
let rotation = [];

function getRotation() {
  return rotation[rotation.length - 1];
}

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
                setInterval(() => {
                    socket.emit('rotation', 45);
                }, 1000);
            const { deviceId } = data;
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
                console.log(": "+ direction)
                socket.to(deviceId).emit("move", direction)
            })
        });
    }
    else if(!user){
        socket.on('join-room-device', (data) => {
            const { pass, deviceId } = data
            console.log("device:", deviceId)
            
            if(pass != process.env.DEVICE_PASS) {
                console.log("wrong pass")
                socket.disconnect();
                return      
            }
            
            console.log("correct pass")
            socket.join(deviceId)
            socket.emit('joined-message', `Welcome to device: ${deviceId}`);
            
            io.on('connection', (socket) => {
            socket.on('rotation', async (angle) => {
                rotation.push(angle);
                console.log("successful emit: " + angle);
              });
              
              setInterval(async() => {
                const socketId = socket.username;
                const rotation = getRotation(); 
                const session = await prisma.user.findFirst({
                  where: { username: socketId },
                });
                console.log(socketId)
                if (session) {
                  await prisma.user.update({
                    where: { username: socketId },
                    data: {
                      rotation
                    }
                  });
                  console.log("successful update")
                }
              }, 10000);
            });
    }   
    )};  
}
);

