const express = require('express');
const sessions = require('express-session');
var parseUrl = require('body-parser');
const app = express.Router();
const { test } = require('../classes/user');


let encodeUrl = parseUrl.urlencoded({extended: false});

app.get('/register', encodeUrl, (req, res) =>{
    res.render('register')
})

app.post('/register', encodeUrl, async (req,res) => {
    const username = req.body.userName;
    const email = req.body.email;
    const password = req.body.passWord;

    const user = await test(username, email, password)

    console.log(user)
});

module.exports = app        
