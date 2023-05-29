import { createClient } from "redis";
import { REDIS_URL } from "../config";
import CustomGraphQLError from "./graphqlError";

const redisClient = createClient({
  url: REDIS_URL,
});

export const connectToRedis = async (url) => {
  try {
    await redisClient.connect();
    console.log("Redis is connected");
  } catch (e) {
    throw new Error(e);
  }
};

const ERROR = {
  response: {
    data: {
      msg: "ทรัพยากรถูกร้องขอมากเกินไป โปรดลองใหม่อีกครั้งภายหลัง",
    },
  },
};

const extractOperationNameAndIP = (ctx) => {
  return {
    operationName: ctx.operationName,
    ip: ctx.ip.replace("::ffff:", ""),
  };
};

export const setRequest = async (operationName, ip, threshold, endedAt) => {
  const response = await redisClient.hGet(operationName, ip);
  if (!response) {
    const value = JSON.stringify({
      count: 1,
      threshold,
      endedAt,
    });
    await redisClient.hSet(operationName, ip, value);
  } else {
    const data = JSON.parse(response)
    const now = Date.now();
    if (now >= data.endedAt) {
      const value = JSON.stringify({
        count: 1,
        threshold,
        endedAt,
      });
      await redisClient.hSet(operationName, ip, value);
    } else {
      if (data.count === threshold) {
        throw new CustomGraphQLError(ERROR);
      } else {
        const updatedValue = JSON.stringify({
          count: data.count + 1,
          threshold,
          endedAt: data.endedAt,
        });
        await redisClient.hSet(operationName, ip, updatedValue);
      }
    }
  }
};

const rateLimit = async (ctx, threshold, minute) => {
  const extracted = extractOperationNameAndIP(ctx);
  const nextSpecifiedMinute = new Date();
  nextSpecifiedMinute.setMinutes(nextSpecifiedMinute.getMinutes() + minute);
  const timestamp = nextSpecifiedMinute.getTime();
  await setRequest(extracted.operationName, extracted.ip, threshold, timestamp);
};

export default rateLimit;
