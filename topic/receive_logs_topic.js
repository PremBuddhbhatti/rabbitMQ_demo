// node receive_logs_topic.js "*.feedback.error"
// node receive_logs_topic.js "#.error"
// node receive_logs_topic.js "us-east.bill.*"

// '*' any one word
// '#' any word 

import amqplib from 'amqplib';

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}


const exchangeName = "topic_logs";

const receiveMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, 'topic', { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });
  console.log(`Waiting for messages in queue: ${q.queue}`);
  args.forEach(function (key) {
    channel.bindQueue(q.queue, exchangeName, key);
  });
  channel.consume(q.queue, msg => {
    if (msg.content) console.log(`Routing Key: ${msg.fields.routingKey}, Message: ${msg.content.toString()}`);
  }, { noAck: true })
}

receiveMsg();