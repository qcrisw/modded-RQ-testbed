module.exports = function _rqJobGenerator(redisClient, queueName) {
  return new function () {
    const me = this

    const createQueue = function _createQueue(queueName) {
      console.log("Should create queue here with name: %s", queueName)
    }

    createQueue(queueName)

    this.enqueue = function _enqueue(funcName, arg, options) {
      const _options = Object.assign({
        timeout: 180,
        result_ttl: 500,
        ttl: 420,
        description: `${funcName}(${arg})`,
        at_front: false
      }, options || {})

      console.log("Should enqueue job here: %s(%s) with options: %o", funcName, arg, _options)
    }
  }
}
