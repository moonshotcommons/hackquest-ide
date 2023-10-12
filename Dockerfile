FROM node:20-bullseye

WORKDIR /home/remix

RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  chromium

COPY package*.json yarn.lock ./

RUN npm i nrm -g

RUN nrm use taobao

RUN npm install -g node-gyp

RUN yarn install

COPY . .

ARG NODE_ENV=$NODE_ENV

RUN echo "The value of MY_ARG is: $NODE_ENV"

RUN yarn run build:$NODE_ENV

EXPOSE 8080

CMD [ "yarn", "run", "serve:production" ]
