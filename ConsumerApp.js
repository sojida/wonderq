const axios = require('axios');
require('dotenv').config()


const port = process.env.PORT || 3000;
const consumableTime = process.env.CONSUMABLE_TIME || 1000;

const queues = ['queue1', 'queue2', 'queue3'];

const Axiosinstance = axios.create({
    baseURL: `http://localhost:${port}`,
});

/**
 * Consumes message by notifiying WonderQ
 * @param {Object} message a message from a queue
 */
const ConsumeMessage = (message) => {
    // simulates delay in cosuming data
    const timeToConsume = Math.floor(Math.random() * (Number(consumableTime) + 1000));
    setTimeout(async() => {
        try {
           const { data } = await Axiosinstance.post(`/message`, {
                id: message.id,
                queue: message.queue
           })
           console.log('success consuming message', message.id, 'in ', message.queue, 'Time to consume:', timeToConsume);
        } catch (error) {
            console.log('error consuming message', message.id, 'Time to consume:', timeToConsume)
        }

    }, timeToConsume)
}

/**
 * Receivees message from a queue at random
 */
const ReceiveData = async () => {
    try {
        const queue = queues[Math.floor(Math.random() * queues.length)];

       const { data: res } = await Axiosinstance.get(`/queue/messages?queue=${queue}`)
       res.data.forEach(ConsumeMessage)
    } catch (error) {
        if (error.response) {
            console.log(error.response.data.message, 'error receiving data')
        }
    }
}

setInterval(ReceiveData, 2000)
