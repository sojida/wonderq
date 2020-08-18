const expect = require('expect.js');
const Queue = require('../Queue');
const Message = require('../Message');


describe('Queue Class', function () {
    it('should function properly with Message Class', () => {
        const messageInstance = new Message('Hi there!', 'queue1')
        const queueInstance = new Queue()
        

        queueInstance.enqueue(messageInstance);
        expect(queueInstance.count).to.be(1);
        expect(messageInstance.state).to.be('INITIAL')

        const [unconsumed] = queueInstance.getUnconsumed();
        expect(unconsumed.state).to.be('CONSUMING')

        queueInstance.consumeMessage(unconsumed);
        expect(unconsumed.state).to.be('CONSUMED')

        expect(queueInstance.count).to.be(0);
    });
});
