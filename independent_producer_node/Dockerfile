FROM node:8
LABEL maintainer="Hossam Hammady <hhammady@hbku.edu.qa>"
WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app

CMD [ "npm", "start" ]
