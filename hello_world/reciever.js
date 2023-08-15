import amqplib from 'amqplib';


const queueName = 'hello';
const msg = 'hello World';

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');

  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: false });

  console.log(`waiting for msg in queue: ${queueName}`);

  channel.consume(queueName, msg => {
    console.log('Received:', msg.content.toString());
  }, { noAck: true })
}

sendMsg();