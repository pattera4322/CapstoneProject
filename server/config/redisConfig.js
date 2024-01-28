const Redis = require("ioredis");

// Replace these with your Redis Cloud connection details
const host = "redis-19738.c295.ap-southeast-1-1.ec2.cloud.redislabs.com";
const port = 19738;
const password = "OBH97QGNgEtGm61w0qZbbjsOfcYhvBGs";

// Connect to Redis
const redis = new Redis({ host, port, password });

// Example: Set a key-value pair
redis.set("example_key", "example_value");

// Example: Get a value
redis.get("example_key").then((value) => {
  console.log(value);
});

// Remember to close the connection when you're done
redis.quit();
