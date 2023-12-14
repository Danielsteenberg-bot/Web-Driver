const express = require('express');
const router = express.Router()
const app = express()
const { getDevices } = require('../classes/devices');
const { getLatestSession, startSession } = require('../classes/session');


// Functions
const checkLogged = (req, res, next) => {
    if (req.session.userId) {
        next()
    }
    else {
        res.redirect('/')
    }
}

const checkDeviceSession = (req, res, next) => {
    if (req.session.connectedDevice) {
        next()
    }
    else {
        res.redirect('dashboard/manage')
    }
}

// Routers
router.route('/')
    .get(checkLogged, checkDeviceSession,  async (req, res) => {
        const session = await startSession(req.session.userId, parseInt(req.session.connectedDevice))
        console.log("current Session: ", session.id);
        req.session.drivingSession = session.id
        res.render('dashboard/dashboard', {
            title: 'dashboard'
        })
    })

router.route('/manage')
    .get(async (req, res) => {

        try {
            const devices = await getDevices()
            // console.log(devices);

            res.render('dashboard/manage', {
                title: "manage",
                devices
            })
        } catch (error) {
            console.log(error);
        }


    })

router.route('/navbar')
    .get((req, res) => {
        res.render('dashboard/navbar', {
            title: "navbar"
        })
    })
router.route('/contact')
    .get((get, res) => {
        res.render('dashboard/contact', {
            title: "contact"
        })
    })

module.exports = router;
