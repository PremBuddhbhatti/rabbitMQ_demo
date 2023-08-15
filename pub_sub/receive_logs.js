import amqplib from 'amqplib';


const exchangeName = 'logs';


const receiveMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');

  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, 'fanout', { durable: false });
  const q = await channel.assertQueue('', { exclusive: true }); // this queue will be deleted once connection is closed

  console.log(`waiting for msg in queue: ${q.queue}`);
  channel.bindQueue(q.queue, exchangeName, '');
  channel.consume(q.queue, msg => {
    if (msg.content) {
      console.log('Received:', msg.content.toString());
    }
  }, { noAck: true })
}

receiveMsg();