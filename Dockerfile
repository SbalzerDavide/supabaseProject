# syntax=docker/dockerfile:1
   
FROM node:16

# set the working direction
WORKDIR /app

# COPY . ./
COPY package.json ./

RUN npm install


# CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0"]
CMD ["npm", "run", "serve"]

