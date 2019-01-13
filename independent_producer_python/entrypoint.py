from uuid import uuid4
from redis import StrictRedis
from datetime import datetime
import logging


def create_mapping(func_name, arg):
    mapping = {}
    # add job status
    mapping['created_at'] = datetime.strftime(datetime.now(), '%Y-%m-%dT%H:%M:%S.%fZ')
    mapping['data'] = func_name + b' ' + arg
    mapping['origin'] = 'default'
    mapping['description'] = func_name+b'('+arg+b')'
    mapping['timeout'] = 180
    mapping['raw'] = "True"
    return mapping

# create RQ job to push to redis
def create_job(func_name, arg):
    job_data = create_mapping(func_name, arg)
    job_uuid = uuid4()
    job_name = str(job_uuid)
    return (job_name, job_data)

def connect_to_redis():
    redis_client = StrictRedis('redis')
    return redis_client

    
def enqueue_job(redis_client, job_id, mapping):
    mapping['status'] = 'queued'
    mapping['enqueued_at'] = datetime.strftime(datetime.now(), '%Y-%m-%dT%H:%M:%S.%fZ')
    # mapping['enqueued_at'] = datetime.now().isoformat()
    redis_client.hmset("rq:job:"+job_id, mapping)
    redis_client.rpush('rq:queue:default', job_id)
    redis_client.sadd('rq:queues', 'rq:queue:default')



if __name__=="__main__":
    #create task
    #enqueue to redis
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    client = connect_to_redis()
    job_id, mapping = create_job(b'consumer1.consume.consume_func', b"4")
    enqueue_job(client, job_id, mapping)