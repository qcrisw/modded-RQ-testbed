const rqJobGenerator = require('./rq-job-generator')

console.log("I am the NodeJS producer!")

redisClient = 0
const queue = rqJobGenerator(redisClient, 'default')
queue.enqueue('consumer1.consume.consume_func',  '{"a": "a.js"}', {description: 'No description!'})
queue.enqueue('consumer1.consume.consume_func',  '{"a": "b.js"}', {timeout: 30})
queue.enqueue('consumer1.consume.consume_func',  '{"a": "c.js"}', {result_ttl: 100})
queue.enqueue('consumer1.consume.consume_func',  '{"a": "d.js"}', {ttl: 200, at_front: true})
queue.enqueue('consumer1.consume.consume_func',  '{"a": "e.js"}', {})
queue.enqueue('consumer1.consume.consume_func',  '{"a": "f.js"}')
