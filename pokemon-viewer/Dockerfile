# Stage 1: Build the app
FROM node:22.13.1-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Declare the build argument and then set it as an environment variable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy the rest of the source code and build the production app
COPY . .
RUN npm run build

# Stage 2: Serve the production build
FROM node:22.13.1-alpine AS runner
WORKDIR /app

# Copy the built assets from the builder stage
COPY --from=builder /app/dist ./dist

# Install a lightweight static server
RUN npm install -g serve

# Expose the port (3000 in this container)
EXPOSE 3000

# Start the server to serve the built app
CMD ["serve", "-s", "dist", "-l", "3000"]
