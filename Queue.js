const MessageState = require('./MessageState')

/** Class representing the queue */
class Queue{
    /**
     * Creates a queue instance 
     * with a dataStore
     */
    constructor(){
        this.dataStore = [];
    }

    /**
     * Adds items to the queue
     * @param {Message} message Message object 
     * @return {void}
     */
    enqueue(message){
        this.dataStore.push(message)
    }

     /**
     * Gets the total items in a queue
     * @return {Number} number of items is this queue
     */
    get count() {
        return this.dataStore.length;
    }

    /**
     * Removes messsages from the queue
     * with status: 'CONSUMED'
     * @return {void}
     */
    removeConsumedMessages() {
        this.dataStore = this.dataStore.filter(message => message.state !== MessageState.CONSUMED)
    }

    /**
     * Returns messages from the queue
     * with status: "INITIAL"
     * @return {void}
     */
    getUnconsumed() {
        const unconsumedData = []
        for(const index in this.dataStore) {
            const message = this.dataStore[index];
            if(message.state === MessageState.INITIAL) {
                message.consuming()
                unconsumedData.push(message)
            }
        }

        return unconsumedData;
    }

    /**
     * Consumes messages from the queue
     * @param {Object} message 
     * @return {Boolean} status of consumption
     */
    consumeMessage(message) {
        const messageToConsume = this.dataStore.find(msg => message.id === msg.id)
        // only messages in the CONSUMING state can be consumed
        if (messageToConsume && messageToConsume.state === MessageState.CONSUMING) {
            messageToConsume.consumed();
            this.removeConsumedMessages();
            return true
        }

        return false;
    }

}

module.exports = Queue;
