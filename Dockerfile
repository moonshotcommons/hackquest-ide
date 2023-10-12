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

RUN yarn run build:production

EXPOSE 8080

CMD [ "yarn", "run", "serve:production" ]
