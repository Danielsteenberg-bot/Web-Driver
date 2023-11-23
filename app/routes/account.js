const express = require('express');
const { validate, register } = require('../classes/user');
const router = express.Router()
const app = express()
const parseUrl = require('body-parser');

let encodeUrl = parseUrl.urlencoded({ extended: false });

router.route('/login')
    .get((req, res) => {
        res.render('login', {
            title: "Login"
        })
    })
    .post(async (req, res) => {
        const data = req.body
        const user = await validate(data.login_username, data.login_password)

        if (user) {
            console.log(user);
        }

    })

router.route('/register')
    .get(encodeUrl, (req, res) => {
        res.render('register')
    })
    .post(encodeUrl, async (req, res) => {
        const username = req.body.userName;
        const email = req.body.email;
        const password = req.body.passWord;

        const user = await register(username, email, password)

        console.log(user)
    });


module.exports = router