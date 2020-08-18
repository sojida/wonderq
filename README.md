# WonderQ

WonderQ is a broker that allows multiple producers to write to it, and multiple consumers to read from it. It runs on a single server. Whenever a producer writes to WonderQ, a message ID is generated and returned as confirmation. Whenever a consumer polls WonderQ for new messages, it gets those messages which are NOT processed by any other consumer that may be concurrently accessing WonderQ.

NOTE that, when a consumer gets a set of messages, it must notify WonderQ that it has processed each message (individually). This deletes that message from the WonderQ database. If a message is received by a consumer, but NOT marked as processed within a configurable amount of time, the message then becomes available to any consumer requesting again


## Setup
- Clone the repository

```bash
git clone https://github.com/sojida/wonderq.git
```

- Install project dependencies

```bash
cd wonderq
npm install
```

- Create a `.env` file and copy the contents of the `.env.example` into it. Or run:

Linux:
```bash
cp .env.example .env
```

Windows:
```shell
xcopy .env.example .env
```

- Start the development server

```bash
npm run start:dev
```

## Testing the App
There are two apps involved in the testing of the WonderQ server, these are the Producer and the Consumer apps. The Producer app is responsible for creating/producing data at 2 seconds interval to 3 different queues in WonderQ at random, while the Consumer app, consumes data from those 3 different queues at 2 seconds intervals. The consumer app also notifies the queue server when it is done consuming a message. To similate a consumer app that delays on message consumptions, the consumer app setup to randomly consume messages from 0 to 1 + `CONSUMABLE_TIME` seconds.

### Setup Producer App
- On a new terminal, run

```bash
node Producerapp.js
```

Messages should be created in WonderQ

### Setup Consumer App
- On a new terminal, run

```bash
node ConsumerApp.js
```

Messages would be consumed from WonderQ. It will show an error if the consumer app takes too long to consume a message.


## Developer tool
A quick developer tool was setup to show the status of WonderQ at anytime. This developer tool shows the queues and the total amount on unconsumed messages in those queues

### Setup Developer Tool
- Ensure WonderQ server is running, if not run 

```bash
npm run start:dev
```

- open browser and navigate to

```bash
http://localhost:{PORT}
```

### API endpoints
WonderQ server exposes API enpoints that are documented on

```bash
http://localhost:{PORT}/api-docs
```


A discussion on how we would you go about scaling this system to meet high-volume requests? What infrastructure / stack would you use and why?

### Content
- The current system
- Scaling this system to meet high-volume request
- What infrastructure/stack would you use and why?


### The Current System
WonderQ module is explosed via a REST api server. Clients(Producers and Consumers) interface with server via REST api endpoints to create(Read) and consume(Write) messages from different queues in WonderQ. The databse is abstracted.

![](https://i.imgur.com/5roWNnP.png)


### Scaling this system to meet high-volume request
As request volume for WonderQ server increases, the following are considered in achieving scalability:

- Persistent connection
Currently, consumers have to poll to get messages from WonderQ servers. To reduce the round trip connection on each request in a polling action, WonderQ server will expose a persistent connection with websockets. This persitent connection with clients(Producers and Consumers) will enable the delivery of data(messages) to clients without clients having to continously make request to the server.

- Horizontal scaling
To manage the high volume of requests, WonderQ servers will also have to scale horizontally. This means that more instances of the servers will be hosted with a load balancer placed in front of all instances to handle the request per server instance.

![](https://i.imgur.com/jCfhtom.png)


### What infrastructure/stack would you use and why?
To achieve a scalable system, the infrastructure/stack I would use will be Nodejs. The reason for the choice of stack includes:
- since WonderQ is not performing heavy CPU task, Nodejs would be a perfect for processing read and write operations
- Nodejs is easy to scale both vertically and horizontally
- Nodejs is highly performant as it supports the non-blocking I/O operations.
- Since NodeJs supports non-blocking I/O operations, this means that it can process many request concurrently.
- Finally, amongst other reasons, Nodejs has a large and active community which is ever evolving and growing.
