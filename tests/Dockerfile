FROM python:3.7
RUN apt-get update && apt-get install -y redis-tools \
                                            redis-server \
                                            tox

COPY tests/requirements.txt /home/requirements.txt

WORKDIR /home
COPY /rq /home/rq/
WORKDIR /home/rq


COPY ./tests/entrypoint.sh .
ENTRYPOINT [ "./entrypoint.sh" ]