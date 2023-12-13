const express = require('express')
const router = express.Router()

router.route('/')
    .get((req, res) => {
    res.render('site/index', {
        title: 'Company'
    })
})



module.exports = router