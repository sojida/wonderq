const axios = require('axios');
const port = process.env.PORT || 3000;
require('dotenv').config()


const queues = ['queue1', 'queue2', 'queue3'];

const Axiosinstance = axios.create({
    baseURL: `http://localhost:${port}`,
});

/**Produces message to random queues */
const Producedata = async () => {
    try {
        const queue = queues[Math.floor(Math.random() * queues.length)];
        const message = 'Hello there!';
       const { data: res } = await Axiosinstance.post('/messages/create', {
            queue,
            message,
          })
        console.log(`Message ${res.data.id} created in ${queue}`);
    } catch (error) {
        if (error.response) {
            console.log(error.response.data.message, 'error producing data')
        }
    }
}

setInterval(Producedata, 2000);
