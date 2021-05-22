FROM node:12

# Create and define the node_modules's cache directory.
RUN mkdir /usr/src/cache
WORKDIR /usr/src/cache

# Install the application's dependencies into the node_modules's cache directory.
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Create and define the application's working directory.
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# COPY package*.json ./

# For Development
# RUN npm install

# For Production 
# RUN npm install && npm run build
# COPY  . .

# EXPOSE 3000


# For Development
# CMD npm run start:dev

# For Production
# CMD npm run start:prod
