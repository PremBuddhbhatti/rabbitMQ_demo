import { connect } from 'amqplib';

const exchangeName = "header_logs";

const receiveMsg = async () => {
  const connection = await connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, 'headers', { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });
  console.log(`Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, exchangeName, '', { 'account': 'new', 'method': 'google', 'x-match': 'any' });

  channel.consume(q.queue, msg => {
    if (msg.content) console.log(`Routing Key: ${JSON.stringify(msg.properties.headers)}, Message: ${msg.content.toString()}`);
  }, { noAck: true })
}

receiveMsg();