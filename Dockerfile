FROM node:12

WORKDIR /app

COPY package*.json ./

# For Development
RUN npm install

# For Production 
# RUN npm install && npm run build

EXPOSE 3000

COPY  . .

# For Development
CMD npm run start:dev

# For Production
# CMD npm run start:prod
