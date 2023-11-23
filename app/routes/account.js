const express = require('express');
const { validate } = require('../classes/user');
const router = express.Router()
const app = express()

router.route('/login')
    .get((req, res) => {
        res.render('login', {
            title: "Login"
        })
    })
    .post(async (req, res) => {
        const data = req.body
        const user = await validate(data.login_username, data.login_password)

        if(user){
            console.log(user);
        }
        
    })




module.exports = router