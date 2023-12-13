const express = require('express');
const router = express.Router()
const app = express()

router.route('/')
    .get((req, res) => {
        res.render('company/index', {
            title: 'Web Driver'
        })
    })

router.route('/privacy')
    .get((req, res) => {

        res.render('company/privacy', {
            title: "Privacy policy"
        })
    })
router.route('/terms')
    .get((req, res) => {

        res.render('company/terms', {
            title: "Terms of Serice"
        })
    })


    module.exports = router;
