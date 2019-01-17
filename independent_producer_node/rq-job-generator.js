const uuidv4 = require('uuid/v4')

module.exports = function _rqJobGenerator(redisClient, queueName) {
  return new function () {
    const me = this

    if (!queueName) {
      throw("queueName cannot be empty")
    }

    const RQ_QUEUE_NAME = `rq:queue:${queueName}`
    const RQ_JOB_PREFIX = "rq:job:"

    const createQueue = function _createQueue(queueName) {
      // initialize queue
      if (!redisClient) {
        throw("No redis client provided")
      }
      redisClient.sadd("rq:queues", RQ_QUEUE_NAME)
      console.log("Created queue with name: %s", queueName)
      // TODO callback
    }

    createQueue(queueName)

    // create RQ job to push to redis
    const createJobMapping = function _createJobMapping(funcName, arg, options) {
      // TODO assert type(arg) == bytes
      return {
        created_at: new Date().toISOString(),
        func_name: funcName,
        arg: arg,
        origin: queueName,
        description: options.description,
        timeout: options.timeout,
        raw: 'True' // TODO is this a string?
      }
      // TODO where are the rest of options consumed?
    }

    this.enqueue = function _enqueue(funcName, arg, options) {
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
      redisClient.hmset(`${RQ_JOB_PREFIX}${job_name}`, mapping)
      if (_options.at_front)
          redisClient.lpush(RQ_QUEUE_NAME, job_name)
      else
          redisClient.rpush(RQ_QUEUE_NAME, job_name)

      // TODO callbacks

      console.log("Enqueued job: %s(%s) with options: %o", funcName, arg, _options)
    }
  }
}
