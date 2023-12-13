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

update();
module.exports = {
    validate,
    register
}