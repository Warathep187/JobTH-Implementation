const amqplib = require("amqplib");

const setup = async () => {
  console.time("takes");
  const connection = await amqplib.connect("amqp://rabbit:1234@localhost:5672");
  const channel = await connection.createConfirmChannel();

  await setAuthServiceExchangesAndQueues(channel);

  console.log("Finished, Queues and Exchanges has been set.💪");
  console.timeEnd("takes");
  process.exit(1);
};

const setAuthServiceExchangesAndQueues = async (channel) => {
  try {
    await channel.assertExchange("AUTH", "direct", {
      durable: true,
    });
    await channel.assertExchange("AUTH.DEAD", "direct", {
      durable: true,
    });

    // Auth service -- Profile service
    await channel.assertQueue("AUTH.PROFILE.ROLLED-BACK", {
      autoDelete: false,
      durable: true,
      deadLetterExchange: "AUTH.DEAD",
      deadLetterRoutingKey: "auth.profile.rolled-back.dead",
    });
    await channel.assertQueue("AUTH.PROFILE.ROLLED-BACK.DEAD", {
      durable: true,
    });

    await channel.bindQueue("AUTH.PROFILE.ROLLED-BACK", "AUTH", "auth.profile.rolled-back");
    await channel.bindQueue("AUTH.PROFILE.ROLLED-BACK.DEAD", "AUTH.DEAD", "auth.profile.rolled-back.dead");
    console.log("Auth service -- Profile service : Configured");
  } catch (e) {
    throw new Error(e);
  }
};

setup();
