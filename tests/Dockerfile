FROM python:3.4 as python3.4
FROM python:3.6 as python3.6
FROM python:3.7 as python3.7
# FROM pypy:2 as pypy
# import everything python3.4
COPY --from=python3.4 /usr/local/bin/python3.4* /usr/local/bin/
COPY --from=python3.4 /usr/local/lib/libpython3.4m.so.1.0 /usr/local/lib/libpython3.4m.so.1.0
COPY --from=python3.4 /usr/local/include/python3.4m /usr/local/include/python3.4m
COPY --from=python3.4 /usr/local/lib/python3.4 /usr/local/lib/python3.4
COPY --from=python3.4 /usr/local/lib/python3.4/site-packages /usr/local/lib/python3.4/site-packages
# import everything python3.6
COPY --from=python3.6 /usr/local/bin/python3.6* /usr/local/bin/
COPY --from=python3.6 /usr/local/lib/libpython3.6m.so.1.0 /usr/local/lib/libpython3.6m.so.1.0
COPY --from=python3.6 /usr/local/include/python3.6m /usr/local/include/python3.6m
COPY --from=python3.6 /usr/local/lib/python3.6 /usr/local/lib/python3.6
COPY --from=python3.6 /usr/local/lib/python3.6/site-packages /usr/local/lib/python3.6/site-packages

RUN apt-get update && apt-get install -y redis-tools \
                                            redis-server \
                                            tox

# RUN pip install tox

WORKDIR /home
COPY /rq /home/rq/
WORKDIR /home/rq


COPY ./tests/entrypoint.sh .
ENTRYPOINT [ "./entrypoint.sh" ]