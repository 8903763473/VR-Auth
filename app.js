require('dotenv').config();
const express = require('express');
const cors = require('cors');
const register = require('../VR-Auth/api/authenticate/auth.router');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(cors()); // Use cors middleware
app.use(express.json());
app.use("/api/auth", register);


io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    io.emit('test event', 'Vijayakumar Here');
});

io.on('disconnect', (socket) => {
    console.log('a user disconnected', socket.id);
});


const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
});
