# Use the official Node.js image as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the required Node.js dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the React app
RUN npm run build

# Serve the React app using a simple HTTP server
RUN npm install -g serve

# Expose port 5000 for the React app
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]