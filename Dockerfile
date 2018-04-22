FROM node:9.5.0-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install --production
CMD [  "npm", "start" ]
EXPOSE 3000