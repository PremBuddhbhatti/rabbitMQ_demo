import amqplib from 'amqplib';


const queueName = 'hello';
const msg = 'hello World';

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');

  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: false });

  channel.sendToQueue(queueName, Buffer.from(msg))

  console.log('sent', msg);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500)
}

sendMsg();