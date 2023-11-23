const express = require('express');
const express_session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app)

app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Routers
app.use('/account', require('./routes/account'))

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});