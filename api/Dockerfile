FROM node:13.13.0-alpine3.11
WORKDIR /app
COPY package*.json ./
COPY src/index.js .
RUN npm install --quiet
COPY . . 
EXPOSE 3000
CMD ["npm","run","dev"]