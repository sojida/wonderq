const expect = require('expect.js');
const WonderQ = require('../Wonderq');
const Queue = require('../Queue');
const Message = require('../Message');


describe('WonderQ class', function () {
    it('should function properly ', () => {
       const newqueue =  WonderQ.createQueue('queue');
       expect(newqueue instanceof Queue).to.be(true);

       const newqueue2 =  WonderQ.createQueue('queue');
       expect(newqueue2).to.be(false);

       const newMessage =  WonderQ.publishTo('queue', 'Hi there');
       expect(newMessage instanceof Message).to.be(true);
       expect(newMessage.message).to.be('Hi there');

       const [message] = WonderQ.getMessages('queue');
       expect(message instanceof Message).to.be(true);
       expect(message.state).to.be('CONSUMING');

       const consumed = WonderQ.consumeMessage(message);
       expect(consumed).to.be(true);
       expect(message.state).to.be('CONSUMED');
    });
});
