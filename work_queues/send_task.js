import amqplib from 'amqplib';


const queueName = 'process_image';
const msg = process.argv.slice(2).join(' ') || 'Hello World!';

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');

  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true })

  console.log('sent', msg);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500)
}

sendMsg();