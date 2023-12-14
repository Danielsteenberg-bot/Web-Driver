const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const startSession = (userId, deviceId) => {
    const session = prisma.session.create({
        data: {
            userid: userId,
            deviceid: deviceId
        }
    })

    return session
}


module.exports = {
    startSession,
}