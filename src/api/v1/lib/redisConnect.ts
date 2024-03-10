import { RedisClientType } from "@redis/client";
import { createClient } from "redis";

let redisClient: RedisClientType;

const redisConnection = async () => {
  if (!redisClient) {
    const options = {
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string),
      },
    };
    redisClient = createClient(options);
    await redisClient.connect();

    redisClient.on("error", (err: unknown) => {
      console.log("Redis Client Error", err);
    });
    console.log("Redis connected successfully");
  }
  return redisClient;
};

export default redisConnection;
