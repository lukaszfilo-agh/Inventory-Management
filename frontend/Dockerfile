# Use the official Node.js image
FROM node:23.9

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Pass API URL at build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Build the React app with the API URL
RUN npm run build

# Install serve for production
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Serve the React app
CMD ["serve", "-s", "build", "-l", "3000"]