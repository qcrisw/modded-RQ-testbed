const redis = require("redis")
const rqJobGenerator = require('./rq-job-generator')
const redisClient = redis.createClient(process.env.REDIS_URL)

const queue = rqJobGenerator(redisClient, process.env.IN_QUEUE, function (err) {
  if (err) {
    console.error("Returning failure")
  }
  else {
    console.log('Returning success')
  }
})

const enqueueCallback = function(err) {
  if (err) {
    console.error("Returning failure")
  }
  else {
    console.log('Returning success')
  }
}

queue.enqueue('consumer1.consume.consume_func',  '{"a": "a.js"}', {description: 'No description!'}, enqueueCallback)
queue.enqueue('consumer1.consume.consume_func',  '{"a": "b.js"}', {timeout: 30}, enqueueCallback)
queue.enqueue('consumer1.consume.consume_func',  '{"a": "c.js"}', {result_ttl: 100}, enqueueCallback)
queue.enqueue('consumer1.consume.consume_func',  '{"a": "d.js"}', {ttl: 200, at_front: true}, enqueueCallback)
queue.enqueue('consumer1.consume.consume_func',  '{"a": "e.js"}', {}, enqueueCallback)
queue.enqueue('consumer1.consume.consume_func',  '{"a": "f.js"}')

redisClient.quit(function(){ process.exit(0) })
