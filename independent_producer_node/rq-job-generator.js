const uuidv4 = require('uuid/v4')

module.exports = function _rqJobGenerator(redisClient, queueName, callback) {
  return new function () {
    const me = this

    if (!queueName) {
      throw("queueName cannot be empty")
    }

    const RQ_QUEUE_NAME = `rq:queue:${queueName}`
    const RQ_JOB_PREFIX = "rq:job:"

    const createQueue = function _createQueue(queueName, callback) {
      // initialize queue
      if (!redisClient) {
        throw("No redis client provided")
      }
      redisClient.sadd("rq:queues", RQ_QUEUE_NAME, function _sadd(err, res) {
        if (!err) {
          console.log("Created queue with name: %s, raw response: %o", queueName, res)
          if (typeof callback === 'function') {
            callback()
          }
        }
        else {
          console.error("Error creating queue with name: %s", queueName)
        }
      })
    }

    createQueue(queueName, callback)

    // create RQ job to push to redis
    const createJobMapping = function _createJobMapping(funcName, arg, options) {
      if (typeof arg != 'string') {
        throw("arg must be of type string")
      }
      return {
        created_at: new Date().toISOString(),
        func_name: funcName,
        arg: arg,
        origin: queueName,
        timeout: options.timeout,
        result_ttl: options.result_ttl,
        ttl: options.ttl,
        description: options.description,
        raw: 'yes'
      }
    }

    this.enqueue = function _enqueue(funcName, arg, options, callback) {
      const _options = Object.assign({
        timeout: 180,
        result_ttl: 500,
        ttl: 420,
        description: `${funcName}(${arg})`,
        at_front: false
      }, options || {})

      const job_name = uuidv4(),
            mapping = createJobMapping(funcName, arg, _options)

      // enqueue job to queue
      var multi = redisClient.multi().hmset(`${RQ_JOB_PREFIX}${job_name}`, mapping)
      const pushMethod = {
        true: 'lpush',
        false: 'rpush'
      }[_options.at_front]
      multi[pushMethod](RQ_QUEUE_NAME, job_name)
      .exec(function (err, replies) {
        if (!err) {
          console.log("Enqueued job: %s(%s) with options: %o", funcName, arg, _options)
          if (typeof callback === 'function') {
            callback()
          }
        }
        else {
          console.error("Error enqueuing job: %s(%s) with options: %o", funcName, arg, _options)
        }
      })
    }
  }
}
