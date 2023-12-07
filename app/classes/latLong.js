const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()
const express = require('express');
const app = express();
const http = require('http');

const latLong = async(lat, long) => {
    const lat = await latitude(lat);
    const long = await prisma.user.create({
        data:{
        lat,
        long
        },
        select: {
            lat:true,
            long:true
        }


    });
    return(lat)
}
module.exports = {
    latLong
}