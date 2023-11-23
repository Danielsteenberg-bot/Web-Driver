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
module.exports = {
    register
}