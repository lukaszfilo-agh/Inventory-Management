# Use the official Node.js image as a parent image
FROM node:23.9

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the required Node.js dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Pass environment variables at build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Inject environment variable into build process
RUN REACT_APP_API_URL=${REACT_APP_API_URL} npm run build

# Install serve for serving the build
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Set the environment variable at runtime (for the server-side)
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Serve the React app
CMD ["serve", "-s", "build", "-l", "3000"]