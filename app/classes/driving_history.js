const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()
const express = require('express');
const app = express();
const http = require('http');

const dHist = async(sessionID, distanceTraveled, angle, battery) => {
    const sessionData = await sessionLog(sessionID)
    const sessionID = await prisma.user.create({
            data : {
                sessionID,
                distanceTraveled,
                angle,
                battery,
                lat,
                long,
                connection

            },
            select : {
                sessionID:true,
                distanceTraveled:true,
                angle:true,
                battery:true,
                lat:true,
                long:true,
                connection:true
            }
        });
        return sessionData;
    }

    module.exports = {
        dHist
    }