const express = require('express');
const {PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router()

router.route('/:history_id')
.get(async (req, res) => {
    try {
        const result = await prisma.$queryRaw(Prisma.sql`SELECT * FROM DrivingHistory WHERE session_id = ${req.params.history_id} ORDER BY time;`);

        // Set headers for Server-Sent Events
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        let index = 0;

        const interval = setInterval(() => {
            if (index < result.length) {
                // Send data as a string
                res.write(`data: ${JSON.stringify(result[index])}\n\n`);
                index++;
            } else {
                clearInterval(interval);
                res.end(); // Close the connection
            }
        }, 200);
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500); // Send error status if something goes wrong
    }
});
module.exports = router;
