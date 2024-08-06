// IMPORTS -
const Redis = require("ioredis");
const configurationKeys  = require("./config-keys");

// REDIS CONFIGURATION -
const redis = new Redis({
    host: configurationKeys.REDIS_HOST,
    port: configurationKeys.REDIS_PORT,
   password: configurationKeys.REDIS_PASSWORD

});  

redis.on("connect", () => {
  console.log("Connected to Redis");
})

module.exports = redis;