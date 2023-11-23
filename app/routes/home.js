const express = require('express');
const router = express.Router()
const app = express()


router.route('/manage')
    .get((req, res) => {
        res.render('dashboard/manage',{
            title: "manage"
        })
    })


module.exports = router;
