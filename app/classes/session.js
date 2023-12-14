const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

// const test = async (user, direction) => {
//     const session = await prisma.session.create({
//         data:{
//             userid: user,
//             direction
//         },
//         select: {
//             id: true,
//             direction: true,
//             userid: true
//         }
//     })

//     return session
// }

// module.exports = {
//     test
// }