# Use the official Node.js 18 image.
# https://hub.docker.com/_/node
FROM node:18-alpine

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy the .npmrc file to handle private npm registry authentication
COPY .npmrc .npmrc

# Copy dependency definitions
COPY package.json yarn.lock /usr/src/app/

# Install dependencies
RUN yarn install --frozen-lockfile

# Get all the code needed to run the app
COPY . /usr/src/app

# Build the Next.js application
RUN yarn build

# Expose the port the app runs in
EXPOSE 3000

# Serve the app using Next.js
CMD ["yarn", "start"]
