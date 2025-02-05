# Use a lightweight Node.js image
FROM node:22.13.1-alpine

# Set the working directory
WORKDIR /app

# Copy package files first for efficient caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 3010

# Start the server
CMD ["node", "dist/server.js"]
