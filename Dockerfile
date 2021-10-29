FROM node:16.1.0

WORKDIR /app

COPY package.json ./

RUN npm install 

COPY . .

CMD ["npm", "run", "start"]