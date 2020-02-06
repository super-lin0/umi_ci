FROM node:latest

WORKDIR /usr/src/app/

COPY package.json ./
RUN npm install --registry=https://registry.npm.taobao.org

COPY ./ ./

RUN ls

# RUN npm run fetch:blocks

CMD ["npm", "run", "start"]