const Queue = require('./Queue');
const Message = require('./Message');

/** Class representing Wonder Q */
class WonderQ {
    /**
     * Create a Wonder Q instance
     * sets up a db
     */
    constructor() {
        this.db = {};
    }

    /**
     * Creates a queue
     * @param {String} queueName A queue name
     * @return {Queue} a Queue object
     */
    createQueue(queueName) {
        if (this.db[queueName]) {
            return false
        }
    
        const newQueue = new Queue();
        this.db[queueName] = newQueue;
        return newQueue;
    }

    /**
     * Publishes messages to a queue
     * @param {String} queue a queue name
     * @param {*} message a message for te queue
     * @return {Message} a Message object
     */
    publishTo(queue, message) {
        const q = this.db[queue];
        const newMessage = new Message(message, queue);

        if (q) {
            q.enqueue(newMessage)
        } else {
            const newQueue = this.createQueue(queue);
            newQueue.enqueue(newMessage);
        }

        return newMessage
    }

    /**
     * Gets all messages from a queue
     * with state: 'INITIAL
     * @param {String} queue a queue name
     * @return {Array} an array of Message object
     */
    getMessages(queue) {
        const q = this.db[queue];
        if (q) {
            const data = q.getUnconsumed();
            return data;
        }
        
        return null;
    }

    /**
     * Consumes a message from a queue
     * @param {Object} message a message object
     * @return {Boolean} status of message consumption
     */
    consumeMessage(message) {
        const q = this.db[message.queue];
        if (q) {
            const consumed = q.consumeMessage(message);
            return consumed;
        }

        return false;

    }

    /**
     * An auxilary method to get all messages in a queue
     * Gets all messages from a queue
     * @param {String} queue a queue name
     * @return {Array} array of Message object
     */
    getAllMessages(queue) {
        if (this.db[queue]){
            return this.db[queue].dataStore
        }

        return null;
    }

    /**
     * An auzilay method to get stats for developer tool
     * Gets WonderQ stats
     * @param {String} queue a queue name
     * @return {Array} array of Stat object
     */
    getStats() {
        return Object.keys(this.db).map(key =>  ({count: this.db[key].count, queue: key}))
    }
}

// On application start, create an instance of wonder queue
const instance = new WonderQ();

module.exports = instance;
