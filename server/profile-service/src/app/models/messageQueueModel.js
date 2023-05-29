import amqplib from "amqplib";
import { MESSAGE_BROKER_URL } from "../config";
import subscribe from "../../subscribe";
import { Queues } from "../../constants/queuesAndExchanges";

let connection;
let channel;

export const connectRabbitMQ = async () => {
  try {
    connection = await amqplib.connect(MESSAGE_BROKER_URL);
    channel = await connection.createChannel();
    console.log("RabbitMQ is connected🐰");
    await checkQueues();
    await subscribe();
  } catch (e) {
    throw new Error(e);
  }
};

export const publish = async (exchange, routingKey, data) => {
  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)), {
    expiration: 5 * 60 * 1000,
  });
};

export const consume = async (queueName, callback) => {
  channel.consume(queueName, callback, {
    noAck: false,
  });
};

export const ack = (msg) => channel.ack(msg);

export const nack = (msg) => channel.nack(msg);

const checkQueues = async () => {
  try {
    await channel.checkQueue(Queues.AUTH_PROFILE_ROLLED_BACK);
    await channel.checkQueue(Queues.AUTH_PROFILE_ROLLED_BACK_DEAD);
  } catch (e) {
    throw new Error(e);
  }
};
