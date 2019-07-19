const login = document.getElementById('login');
login.onsubmit = e => {
    e.preventDefault();
    
    if (login.userName.value.length) {
        login.style.display = 'none';
        startChat(login.userName.value)
    }
}

function startChat(user) {
    let chat = document.getElementById('chat');
    chat.style.display = 'block';

    document.getElementById('name').innerHTML = user;

    let socket = io('http://localhost:3000', { transports: ['websocket'] });

    socket.emit('userLogged');

    function datetimeSanitized(datetime) {
        return datetime.slice(11, 16);
    }

    function renderMessage(message) {
        const messages = document.querySelector('[messages]');
        if (user == message.from_user)
            messages.innerHTML += `<li class="message send-msg"><ul><li>${message.message}</li><li class="time">${datetimeSanitized(message.datetime)}</li></ul></li>`;
        else
            messages.innerHTML += `<li class="message received-msg"><ul><li class="user">${message.from_user}</li><li>${message.message}</li><li class="time">${datetimeSanitized(message.datetime)}</li></ul></li>`;

    }

    socket.on('previousMessages', messages =>
        messages.forEach(message => renderMessage(message)));

    socket.on('receivedMessage', message =>
        renderMessage(message));

    chat.onsubmit = e => {
        e.preventDefault();

        if (user.length && chat.message.value.length) {
            socket.emit('sendMessage', {
                from_user: user,
                message: chat.message.value
            });
            chat.message.value = '';
        }

    };
}