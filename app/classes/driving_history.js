const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()
const express = require('express');
const app = express();
const http = require('http');

const dHist = async(sessionID, distance, angle, battery) => {
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
        dHist
    }