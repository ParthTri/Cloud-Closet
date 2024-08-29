# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /home/node/app

# Copy the package.json and package-lock.json files

# Install the Node.js dependencies
RUN npm install -g @nestjs/cli

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD [ "node", "./dist/main.js" ]
