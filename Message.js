const RandomString = require('randomstring');
const MessageState = require('./MessageState')
require('dotenv').config()

const consumableTime = process.env.CONSUMABLE_TIME || 1000;

/**Class representing a Message object */
class Message {
    /**
     * Creates a message instance
     * @param {*} message message 
     * @param {String} queue a queue name
     */
    constructor(message, queue) {
        this.id = RandomString.generate(5);
        this.message = message;
        this.processed = false;
        this.queue = queue;
        this.state = MessageState.INITIAL;
        this.timeOut = () => setTimeout(() => {
            this.state = MessageState.INITIAL
        }, consumableTime);
    }

    /**
     * Changes the state of a message to 'CONSUMING'
     */
    consuming() {
        this.state = MessageState.CONSUMING
        this.timeOut();
    }

    /**
     * Changes the state of a message to 'CONSUMED'
     */
    consumed() {
        this.state = MessageState.CONSUMED
        clearTimeout(this.timeOut);
    }
}

module.exports = Message;
