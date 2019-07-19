const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

const messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.on('userLogged', () => socket.emit('previousMessages', messages));

    socket.on('sendMessage', data => {
        if (data.from_user.length && data.message.length) {
            data.datetime = new Date();
            messages.push({
                from_user: data.from_user,
                message: data.message,
                datetime: data.datetime
            });
            
            socket.broadcast.emit('receivedMessage', data);
            socket.emit('receivedMessage', data);
        }
    });
});

server.listen(3000);