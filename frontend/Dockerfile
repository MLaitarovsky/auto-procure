# frontend/Dockerfile

# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
# (Optional for dev, but good practice for "finished" projects)
# RUN npm run build 

# Expose port 3000
EXPOSE 3000

# Start the app in development mode (easiest for demos)
CMD ["npm", "run", "dev"]