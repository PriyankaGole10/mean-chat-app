# Use the official Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Angular port
EXPOSE 4200

# Start Angular
CMD ["npm", "start", "--", "--host", "0.0.0.0"]