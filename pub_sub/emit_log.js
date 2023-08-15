import amqplib from 'amqplib';


const exchangeName = 'logs';
const msg = process.argv.slice(2).join(' ') || 'Hello World!';

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');

  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, 'fanout', { durable: false }); // it will send msg to all queues

  channel.publish(exchangeName, '', Buffer.from(msg))

  console.log('sent: ', msg);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500)
}

sendMsg();