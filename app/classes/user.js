const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()
const bcrypt = require ('bcrypt');

const hashPassword = async (pass) => await bcrypt.hash(pass, 10)
const comparePassword = async (pass, hash) => await bcrypt.compare(pass, hash)

const register = async (username, email, password) => {
    const hash = await hashPassword(password)
    const user = await prisma.user.create({
        data : {
            username, 
            password:hash,
            email

        },
        select : {
            id:true,
            email:true,
            username:true
        }
    })
    return user;
}

const validate = async (loginName, password) => {
    const user = await prisma.user.findFirst({
        where: {
            OR:[
                {email: loginName},
                {username: loginName}
            ]
        }
    })
    if (user) {
            let result = await comparePassword(password, user.password)
            if(!result) return false

            return user
    }

    return false
} 

let rotation = [];

socket.on('rotation', async (angle) => {
    const session = await data(userID,angle);
    rotation.push(angle);
    console.log("successful socket")
});

setInterval(async() => {
    const session = await prisma.user.update({
        where: { id: userId },
        data: {
            rotation
        }
    });
    post(rotation);
    console.log("successful post");
}, 10000);



update();
module.exports = {
    validate,
    register
}