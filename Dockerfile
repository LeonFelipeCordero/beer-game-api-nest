FROM node:14.1.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn 

COPY . .

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start:prod"]
