const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()

const getDevices = () => {
    const devices = prisma.device.findMany({
        select: {
            id: true
        }
    })

    return devices
}



module.exports = {
    getDevices,
}