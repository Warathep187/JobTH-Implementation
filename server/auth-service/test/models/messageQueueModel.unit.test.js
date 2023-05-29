import amqplib from "amqplib";
import { connectRabbitMQ, publish } from "../../src/app/models/messageQueueModel";
import { MESSAGE_BROKER_URL } from "../../src/app/config";

jest.mock("../../src/app/config", () => ({
  MESSAGE_BROKER_URL: "MESSAGE_BROKER_URL",
}));
jest.mock("amqplib");

describe("Connect to RabbitMQ func", () => {
  afterEach(() => {
    amqplib.connect.mockRestore();
  });

  it("connect failed", async () => {
    amqplib.connect.mockRejectedValueOnce("ERROR");

    try {
      await connectRabbitMQ(MESSAGE_BROKER_URL);
    } catch (e) {
      expect(e.message).toBe("ERROR");
      expect(amqplib.connect).toHaveBeenCalledWith(MESSAGE_BROKER_URL);
    }
  });

  it("create channel failed", async () => {
    amqplib.connect.mockResolvedValueOnce({
      createChannel: jest.fn().mockRejectedValueOnce("ERROR"),
    });

    try {
      await connectRabbitMQ(MESSAGE_BROKER_URL);
    } catch (e) {
      expect(e.message).toBe("ERROR");
      expect(amqplib.connect).toHaveBeenCalledWith(MESSAGE_BROKER_URL);
    }
  });

  it("connected and created channel", async () => {
    const createChannel = jest.fn();
    amqplib.connect.mockResolvedValueOnce({
      createChannel,
    });
    await connectRabbitMQ(MESSAGE_BROKER_URL);
    expect(amqplib.connect).toHaveBeenCalledWith(MESSAGE_BROKER_URL);
    expect(createChannel).toHaveBeenCalled();
  });
});

describe("Publish message func", () => {
  it("publish() has been called", async () => {
    const exchange = "EXCHANGE";
    const routingKey = "ROUTING_KEY";
    const data = "DATA";

    const createChannel = jest.fn(() => ({
      publish: jest.fn(),
    }));
    amqplib.connect.mockResolvedValueOnce({
      createChannel,
    });

    await connectRabbitMQ(MESSAGE_BROKER_URL);
    await publish(exchange, routingKey, data);

    expect(amqplib.connect).toHaveBeenCalledWith(MESSAGE_BROKER_URL);
    expect(createChannel).toHaveBeenCalled();
    expect(createChannel.mock.results[0].value.publish).toHaveBeenCalledWith(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(data))
    );
  });
});
