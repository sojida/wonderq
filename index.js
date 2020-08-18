const express = require('express')
const WonderQ = require('./Wonderq');
var bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000;

const swaggerDocument = require('./swagger.json');
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/json' }));


app.get("/", (req, res) => {
    const stats = WonderQ.getStats();
    res.render("index", { stats });
  });

app.post('/queue/create', (req, res) => {
    
    const queue = req.body.queue;

    if (!queue) {
        return res.status(400).json({
            status: 'error',
            message: 'queue is required'
        })
    }

    const created = WonderQ.createQueue(queue);

    if (created) {
        return res.status(201).json({
            status: 'success',
            message: 'Successfully created queue'
        })
    }

    return res.status(409).json({
        status: 'error',
        message: 'This queue already exists'
    })
  
})

app.post('/messages/create', (req, res) => {

    const queue = req.body.queue;
    const message = req.body.message;

    if (!queue) {
        return res.status(400).json({
            status: 'error',
            message: 'queue is required'
        })
    }

    if (!message) {
        return res.status(400).json({
            status: 'error',
            message: 'message is required'
        })
    }

    const data = WonderQ.publishTo(queue, message)

    return res.status(201).json({
        status: 'success',
        message: 'Message created successfully',
        data,
    })
})

app.get('/queue/messages', (req, res) => {
    
    const queue = req.query.queue;

    if (!queue) {
        return res.status(400).json({
            status: 'error',
            message: 'queue is required in query params'
        })
    }

    const data = WonderQ.getMessages(queue)
   
    if (data) {
        return res.status(200).json({
            status: 'success',
            message: 'successfully retrieved messages',
            data
        })
    }

    return res.status(404).json({
        status: 'error',
        message: 'queue does not exist',
    })
})

app.post('/message', (req, res) => {
    
    const message = req.body;

    if (!message.queue || !message.id) {
        return res.status(400).json({
            status: 'error',
            message: 'message.queue or message.id is required'
        })
    }

    const consumed = WonderQ.consumeMessage(message)

    if (consumed) {
        return res.status(200).json({
            status: 'success',
        })
    }

    return res.status(404).json({
        status: 'status',
        message: 'error consuming message'
    })
    
})

// auxilary endpoint to get all messages in queue
app.get('/queue/messages', (req, res) => {
    
    const queue = req.body.queue;

    const data = WonderQ.getAllMessages(queue);

    if (data) {
        return res.status(200).json({
            status: 'success',
            message: 'successfully retrieved messages',
            data
        })
    }

    return res.status(404).json({
        status: 'error',
        message: 'queue does not exist',
    })
})



app.listen(port, () => {
  console.log(`Wonder Q running on http://localhost:${port}`)
})