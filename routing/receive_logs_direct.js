// node receive_logs_direct.js info warn  -- this queue will only listen to 'info' and 'warn' routing key

// node receive_logs_direct.js error info warn  -- this queue will only listen to all 3 routing key

import amqplib from 'amqplib';

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log('NO args found!');
  process.exit(1);
}

const exchangeName = 'direct_logs';


const receiveMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');

  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, 'direct', { durable: false });
  const q = await channel.assertQueue('', { exclusive: true }); // this queue will be deleted once connection is closed

  console.log(`waiting for msg in queue: ${q.queue}`);
  args.forEach(severity => {
    channel.bindQueue(q.queue, exchangeName, severity)
  })
  channel.consume(q.queue, msg => {
    if (msg.content) {
      console.log(`Routing key: ${msg.fields.routingKey}, Message: ${msg.content.toString()}`);
    }
  }, { noAck: true })
}

receiveMsg();