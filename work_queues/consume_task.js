import amqplib from 'amqplib';


const queueName = 'process_image';


const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');

  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });

  channel.prefetch(1);
  console.log(`waiting for msg in queue: ${queueName}`);

  channel.consume(queueName, msg => {
    const secs = msg.content.toString().split('.').length - 1;
    console.log('Received:', msg.content.toString());

    setTimeout(() => {
      console.log('Done resizing Image!');
      channel.ack(msg)
    }, secs * 1000)
  }, { noAck: false })
}

sendMsg();