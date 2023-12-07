const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()
const express = require('express');
const app = express();
const http = require('http');

const velocity = async(velocity) => {
    const velocityData = await veloData(velocity);
    const velocityCreate = await prisma.user.create({
        data: {
            velocity
        },
        select: {
            velocity:true
        }
    })
}

module.exports = {
    velocity
}