const expect = require('expect.js');
const Message = require('../Message');

describe('Message Class', function () {
    it('should change state', () => {
        const messageInstance = new Message('Hi there!', 'queue1')

        expect(messageInstance.message).to.be('Hi there!')
        expect(messageInstance.state).to.be('INITIAL')
    
    
        messageInstance.consuming()
        expect(messageInstance.state).to.be('CONSUMING')
    
        messageInstance.consumed()
        expect(messageInstance.state).to.be('CONSUMED')
    });
});
