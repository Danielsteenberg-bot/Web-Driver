const express = require('express');
const router = express.Router()
const app = express()
const locations = [
    [56.46431,9.411736],
    [56.464302,9.41168],
    [56.464264,9.411452],
    [56.464249,9.411362],
    [56.46423,9.411219],
    [56.464218,9.411148],
    [56.464207,9.411071],
    [56.46418,9.410892],
    [56.464169,9.410824],
    [56.464161,9.410748],
];
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
router.route('/navMap')
    .get((req, res) => {
        res.render('dashboard/NavMap', {
            title: "navMap",
            locations: locations
        });
    });     

module.exports = router;
