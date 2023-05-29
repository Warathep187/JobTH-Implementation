import amqplib from "amqplib";
import { Exchanges, Queues, RoutingKeys } from "../../constants/queuesAndExchanges";

let connection;
let channel;

export const connectRabbitMQ = async (url) => {
  try {
    connection = await amqplib.connect(url);
    channel = await connection.createChannel();
    console.log("RabbitMQ is connected🐰");
    await assertExchangesAndQueues();
  } catch (e) {
    throw new Error(e);
  }
};

const assertExchangesAndQueues = async () => {
  try {
    await channel.assertExchange(Exchanges.AUTH, "direct", {
      durable: true,
    });
    await channel.assertExchange(Exchanges.AUTH_DEAD, "direct", {
      durable: true,
    });

    // Auth service -- Profile service
    await channel.assertQueue(Queues.AUTH_PROFILE_ROLLED_BACK, {
      autoDelete: false,
      durable: true,
      deadLetterExchange: Exchanges.AUTH_DEAD,
      deadLetterRoutingKey: RoutingKeys.AUTH_PROFILE_ROLLED_BACK_DEAD,
      messageTtl: 30 * 1000,
    });
    await channel.assertQueue(Queues.AUTH_PROFILE_ROLLED_BACK_DEAD, {
      durable: true,
    });

    await channel.bindQueue(Queues.AUTH_PROFILE_ROLLED_BACK, Exchanges.AUTH, RoutingKeys.AUTH_PROFILE_ROLLED_BACK);
    await channel.bindQueue(
      Queues.AUTH_PROFILE_ROLLED_BACK_DEAD,
      Exchanges.AUTH_DEAD,
      RoutingKeys.AUTH_PROFILE_ROLLED_BACK_DEAD
    );
    console.log("Auth service -- Profile service : Configured");
  } catch (e) {
    throw new Error(e);
  }
};

export const publish = async (exchange, routingKey, data) => {
  channel.publish(
    exchange,
    routingKey,
    Buffer.from(JSON.stringify(data))
  );
};
