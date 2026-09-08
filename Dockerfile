# Use official Node.js image
FROM node:24-alpine

# Working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose application port
EXPOSE 5000

# Start application
CMD ["npm", "start"]