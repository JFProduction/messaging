# docker build .
# docker run -t <container_id>

FROM node:5.5.0-slim

# Create app directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY src /usr/src/app

# Exposing port 3000
EXPOSE 3000

# Starting the app
CMD ["npm", "start"]