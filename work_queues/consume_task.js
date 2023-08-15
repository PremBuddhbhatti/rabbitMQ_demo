import amqplib from 'amqplib';


const queueName = 'process_image';


const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');

  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });

  channel.prefetch(1); // do not send next msg until previous one is processed

  console.log(`waiting for msg in queue: ${queueName}`);

  channel.consume(queueName, msg => {
    // CMD to run: node send_task.js test... 
    const secs = msg.content.toString().split('.').length - 1; // it will wait for 1 second for each dot
    console.log('Received:', msg.content.toString());

    setTimeout(() => {
      console.log('Done resizing Image!');
      channel.ack(msg) // send acknowledgement once task is completed
    }, secs * 1000)
  }, { noAck: false })
}

sendMsg();