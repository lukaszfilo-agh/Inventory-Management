# Use Node.js as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY warehouse-manager/package*.json ./

# Install the React dependencies
RUN npm install

# Copy the React app into the container
COPY warehouse-manager/ .

# Build the React app for production
RUN npm run build

# Install a simple server to serve the build
RUN npm install -g serve

# Expose port 3000 for the frontend
EXPOSE 3000

# Command to start the React app
CMD ["serve", "-s", "build", "-l", "3000"]