from uuid import uuid4
from redis import StrictRedis
from datetime import datetime
from json import dumps
import logging


class IndependentQueue():
    redisClient = None
    queueName = None

    RQ_QUEUE_PREFIX = "rq:queue:"
    RQ_JOB_PREFIX = "rq:job:"

    def __init__(self, queueName='default', redisClient=None):
        # initialize queue
        self.queueName = queueName
        if redisClient is None:
            raise ValueError("No redis client provided")
        self.redisClient = redisClient
        self.redisClient.sadd("rq:queues", self.RQ_QUEUE_PREFIX+str(queueName))
    
    # create RQ job to push to redis
    def create_job(self, func_name, arg, timeout=180, result_ttl=500, 
                    ttl=420, description=None, depends_on=None,
                    job_id=None, at_front=False, meta=None, raw=False):
        assert type(arg) == bytes
        mapping = {}
        mapping['created_at'] = datetime.strftime(datetime.now(), '%Y-%m-%dT%H:%M:%S.%fZ')
        mapping['func_name'] = func_name
        mapping['arg'] = arg
        mapping['origin'] = self.queueName
        mapping['description'] = description if description is not None else func_name
        mapping['timeout'] = timeout
        mapping['raw'] = str(raw)

        job_name = str(uuid4())
        return (job_name, mapping)

    def enqueue(self, func_name, arg, timeout=180, 
                    result_ttl=500, ttl=420, description=None, depends_on=None,
                    job_id=None, at_front=False, meta=None, raw=False):
        # create job from data provided
        job_name, job = self.create_job(func_name, arg, timeout, result_ttl, ttl, 
                        description, depends_on, job_id, at_front, meta, raw)
        # enqueue job to queue
        self.redisClient.hmset(self.RQ_JOB_PREFIX+str(job_name), job)
        if at_front:
            self.redisClient.lpush(self.RQ_QUEUE_PREFIX+str(self.queueName), job_name)
        self.redisClient.lpush(self.RQ_QUEUE_PREFIX+str(self.queueName), job_name)


if __name__=="__main__":
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    host = 'redis'
    port = 6379
    db = 0

    redisClient = StrictRedis(host=host, port=port, db=db)

    queue = IndependentQueue(redisClient=redisClient)
    queue.enqueue('consumer1.consume.consume_func',  b'{"a": "b"}')
