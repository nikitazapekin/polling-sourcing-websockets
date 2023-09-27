//npm  i express cors ws nodemon
const express = require('express');
const cors = require('cors');
const events = require('events')
const PORT = 5000;

const emitter = new events.EventEmitter();

const app = express()

app.use(cors())
app.use(express.json())

app.get('/get-messages', (req, res) => {
    emitter.once('newMessage', (message) => { // возвращаем всем участникам ответ
        res.json(message)
    })
})

app.post('/new-messages', ((req, res) => {
    const message = req.body;
    emitter.emit('newMessage', message) // вызываем событие
    res.status(200)
}))


app.listen(PORT, () => console.log(`server started on port ${PORT}`))