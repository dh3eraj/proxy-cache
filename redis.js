const { createClient } = require("redis");

const redisClient = createClient();
redisClient.on("error", (error) => {
  console.error(error);
});
redisClient.on("connect", () => {
  console.log("connected to redis.");
});
redisClient.connect();
module.exports = redisClient;