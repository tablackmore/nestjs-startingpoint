# Set the base image
FROM node:18.12.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Build your app
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main"]
