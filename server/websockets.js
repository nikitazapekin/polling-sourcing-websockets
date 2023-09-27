/*const ws = require('ws');

const wss = new ws.Server({
    port: 5000,
}, () => console.log(`Server started on 5000`))


wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                break;
            case 'connection':
                broadcastMessage(message)
                break;
        }
    })
})

function broadcastMessage(message, id) {
    wss.clients.forEach(client => {
        console.log(id, message)
        client.send(JSON.stringify(message))
    })
}*/


const ws = require('ws');

const wss = new ws.Server({
    port: 5000,
}, () => console.log(`Server started on 5000`))

// Store connected clients
const clients = new Map();

wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        switch (message.event) {
            case 'connection':
                handleConnection(message, ws);
                break;
            case 'privateMessage':
                handlePrivateMessage(message);
                break;
        }
    });

    ws.on('close', () => {
        // Remove the client from the clients map
        clients.delete(ws.username);
        broadcastUserList();
    });
});

function handleConnection(message, ws) {
    const { username } = message;
    ws.username = username;
    clients.set(username, ws);

    broadcastUserList();
}

function handlePrivateMessage(message) {
    const { to, text } = message;
    const from = message.username;

    if (clients.has(to)) {
        const targetClient = clients.get(to);
        targetClient.send(JSON.stringify({
            event: 'privateMessage',
            from,
            text,
        }));
    }
}

function broadcastUserList() {
    const userList = Array.from(clients.keys());
    const userListMessage = JSON.stringify({
        event: 'userList',
        userList,
    });

    // Broadcast the updated user list to all connected clients
    clients.forEach(client => {
        client.send(userListMessage);
    });
}
