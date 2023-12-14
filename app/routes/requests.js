const express = require('express');
const { getDevices } = require('../classes/devices');
const router = express.Router()

router.route('/connectDevice')
    .post(async (req, res) => {
        try {
            const data = req.body;

            // Validate data 
            if (!data || isNaN(parseInt(data.deviceId, 10))) {
                return res.status(400).json({ error: 'Invalid data' });
            }
            
            req.session.connectedDevice = data.deviceId
            res.json({ success: true, message: 'Connected to device', deviceId: data.deviceId, link: '/dashboard' });
        } catch (error) {
            console.error('Error in /connectDevice:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });




module.exports = router