const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()
const express = require('express');
const app = express();
const http = require('http');

const sensor1 = async(sensorData1) => {
    const sensorD1 = await sd1(sensorData1);
    const sensorTable1 = await prisma.user.create({
        data: {
            sensorData1
        },
        select:{
            sensorData1:true
        }
        
    });
    return(sensorD1)
}

const sensor2 = async(sensorData2) => {
    const sensorD2 = await sd2(sensorData2);
    const sensorTable2 = await prisma.user.create({
        data: {
            sensorData2
        },
        select: {
            sensorData2
        }
    });
    return(sensorD2)
}

const sensor3 = async(sensorData3) => {
    const sensorD3 = await sd3(sensorData3);
    const sensorTable3 = await prisma.user.create({
        data: {
            sensorData3
        },
        select: {
            sensorData3:true
        }
    });
    return(sensorD3)
}
module.exports = {
    sensor1,
    sensor2,
    sensor3
}

