FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install && npm run build

EXPOSE 3000

COPY  . .

CMD npm run start:prod