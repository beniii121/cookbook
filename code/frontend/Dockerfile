FROM node:latest

EXPOSE 80

WORKDIR /var/www/ui/

# copying the .json files over to the container
COPY ./ui/package*.json ./

# installing the dependencies
RUN npm install

# copying the rest of the application
COPY . .

# running the app
CMD ["npm", "run", "dev"]