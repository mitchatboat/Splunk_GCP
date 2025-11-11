FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm install

# Copy application code
COPY . .

# Build Next.js (needs devDependencies)
RUN npm run build

# Expose port
EXPOSE 8080

# Start server
CMD ["npm", "start"]