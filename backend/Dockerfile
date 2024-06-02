FROM node:latest

# exposing the port on which the API is accessible
EXPOSE 8080

# setting the working directory
WORKDIR /usr/src/webdev

# copy package.json and package-lock.json (if exists) from host to container
COPY package*.json .

# install dependencies
RUN npm ci

# installing sqlite for the local database
RUN apt-get update && apt-get install sqlite3 mc -y

# copy the rest of the application files from host to container
COPY . .

RUN sqlite3 ./db/recipes.db '.exit'

CMD ["node", "main.js"]