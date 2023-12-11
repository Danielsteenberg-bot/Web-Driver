const express = require('express');
const { validate, register } = require('../classes/user');
const router = express.Router()
const app = express()
const parseUrl = require('body-parser');

let encodeUrl = parseUrl.urlencoded({ extended: false });

// Functions
const checkLogged = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/dashboard/manage')
    }
    else {
        next()
    }
}

// Routers
router.route('/')
    .get((req, res) => {
        res.render('account/login', {
            title: "Login"
        })
    })
    .post(async (req, res) => {
        const data = req.body
        const user = await validate(data.login_username, data.login_password)

        if (user) {
            req.session.userId = user.id
            res.redirect('/dashboard/control')
        }

    })

router.route('/register')
    .get(encodeUrl, (req, res) => {
        res.render('account/register')
    })
    .post(encodeUrl, async (req, res) => {
        const username = req.body.userName;
        const email = req.body.email;
        const password = req.body.passWord;

        const user = await register(username, email, password)

        if(user){
            res.redirect('/')
        }

        console.log(user)
    });

module.exports = router