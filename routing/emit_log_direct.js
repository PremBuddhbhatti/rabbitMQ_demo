// node emit_log_direct.js warn 'hi' -- first arg is routing key and second is msg
import amqplib from 'amqplib';


const exchangeName = 'direct_logs';
const args = process.argv.slice(2)
const msg = args[1] || 'Hello World!';
const logType = args[0];

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');

  const channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, 'direct', { durable: false });

  channel.publish(exchangeName, logType, Buffer.from(msg))

  console.log('sent: ', msg);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500)
}

sendMsg();