# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY ./backend .

WORKDIR /usr/src/app/backend

# Install the Node.js dependencies
RUN npm install -g @nestjs/cli
RUN npm install i --omit=dev
RUN npm run build

# Expose the port the app runs on
EXPOSE 8081

# Define the command to run the application
CMD [ "npm", "run start:prod" ]