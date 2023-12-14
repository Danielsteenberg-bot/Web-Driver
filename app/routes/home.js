const express = require('express');
const router = express.Router()
const app = express()

// Functions
const checkLogged = (req, res, next) => {
    if (req.session.userId) {
        next()
    }
    else {
        res.redirect('/')
    }
}

// Routers
router.route('/')
    .get((req, res) => {
        res.render('dashboard/dashboard', {
            title: 'dashboard'
        })
    })

router.route('/manage')
    .get((req, res) => {

        res.render('dashboard/manage', {
            title: "manage"
        })
    })

router.route('/control')
    .get((req, res) => {
        res.render('dashboard/control', {
            userId: req.session.userId
        })
    
    })


router.route('/navbar')
    .get((req, res) => {
        res.render('dashboard/navbar', {
            title: "navbar"
        })
    })
router.route('/contact')
    .get((get, res) =>{
        res.render('dashboard/contact',{
            title: "contact"
        })
    })

module.exports = router;
