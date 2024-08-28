# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY ./backend/package*.json ./

# Install the Node.js dependencies
RUN npm install -g @nestjs/cli
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
RUN pnpm install

# Expose the port the app runs on
EXPOSE 8081

# Define the command to run the application
CMD [ "node", "dist/main.js" ]