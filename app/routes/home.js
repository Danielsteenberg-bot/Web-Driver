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
router.route('/manage')
    .get((req, res) => {
        
        res.render('dashboard/manage', {
            title: "manage"
        })
    })




module.exports = router;
