const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()
const express = require('express');
const app = express();
const http = require('http');

const register = async(x, y) => {
    const x = await sessionLog(x)
    const x = await prisma.user.create({
        data:{
            x,
            y
        },
        select:{
            x:true,
            y:true
        }
    });
    return x;

}

module.exports = {
    register
}