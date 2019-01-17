const redis = require("redis")
const rqJobGenerator = require('./rq-job-generator')
const redisClient = redis.createClient(process.env.REDIS_URL)

redisClient.on("error", function (err) {
  console.log("Error " + err)
  process.exit(1)
});

const queue = rqJobGenerator(redisClient, process.env.IN_QUEUE)
queue.enqueue('consumer1.consume.consume_func',  '{"a": "a.js"}', {description: 'No description!'})
queue.enqueue('consumer1.consume.consume_func',  '{"a": "b.js"}', {timeout: 30})
queue.enqueue('consumer1.consume.consume_func',  '{"a": "c.js"}', {result_ttl: 100})
queue.enqueue('consumer1.consume.consume_func',  '{"a": "d.js"}', {ttl: 200, at_front: true})
queue.enqueue('consumer1.consume.consume_func',  '{"a": "e.js"}', {})
queue.enqueue('consumer1.consume.consume_func',  '{"a": "f.js"}')

redisClient.quit(function(){ process.exit(0) })
