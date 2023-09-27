/*import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";

const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef()
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('')

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose= () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message));
        setValue('')
    }


    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        type="text"
                        placeholder="Введите ваше имя"/>
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
        )
    }


    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text"/>
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ? <div className="connection_message">
                                    Пользователь {mess.username} подключился
                                </div>
                                : <div className="message">
                                    {mess.username}. {mess.message}
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSock; */


import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef();
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');
    const [recipient, setRecipient] = useState('');
    const [userList, setUserList] = useState([]);

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000');

        socket.current.onopen = () => {
            setConnected(true);
            const message = {
                event: 'connection',
                username,
                id: Date.now(),
            };
            socket.current.send(JSON.stringify(message));
        };

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            switch (message.event) {
                case 'privateMessage':
                    setMessages(prev => [...prev, message]);
                    break;
                case 'userList':
                    setUserList(message.userList);
                    break;
                default:
                    break;
            }
        };

        socket.current.onclose = () => {
            console.log('Socket закрыт');
        };

        socket.current.onerror = () => {
            console.log('Socket произошла ошибка');
        };
    }

    const sendMessage = async () => {
        if (recipient && value) {
            const message = {
                username,
                to: recipient,
                text: value,
                id: Date.now(),
                event: 'privateMessage',
            };
            socket.current.send(JSON.stringify(message));
            setValue('');
        }
    };

    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Введите ваше имя"
                    />
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
        );
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        type="text"
                        placeholder="Введите имя получателя"
                    />
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        type="text"
                    />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map((mess) => (
                        <div key={mess.id}>
                            <div className="message">
                                {mess.from}: {mess.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="user-list">
                    <h3>Online Users:</h3>
                    <ul>
                        {userList.map((user) => (
                            <li key={user}>{user}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WebSock;
