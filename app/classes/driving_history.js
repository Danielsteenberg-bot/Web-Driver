const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()
const express = require('express');
const {Server} = require('socket.io')
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);

const listener = (driving) => {
    console.log(driving);
}

socket.on("forward", listener);

socket.on("left", listener);

socket.on("right", listener);

socket.on("backwards", listener);

const driver = async(forward, left, right, backwards) => {
    const drivingData = await sessionLog(forward)
}



const register = async(sessionID, distance, angle, battery) => {
    const sessionData = await sessionLog(sessionID)
    const sessionID = await prisma.user.create({
            data : {
                sessionID,
                distance,
                angle,
                battery

            },
            select : {
                sessionID:true,
                distance:true,
                angle:true,
                battery:true
            }
        });
        return sessionData;
    }

    module.exports = {
        register
    }