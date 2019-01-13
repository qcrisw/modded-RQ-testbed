FROM python:3.7

RUN pip install redis

COPY entrypoint.py /home
WORKDIR /home
ENTRYPOINT [ "python", "entrypoint.py"]
