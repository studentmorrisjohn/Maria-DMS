FROM node:lts-slim

# Create a directory in the root of the container
RUN mkdir /app

# Copy the contents of the current directory to the /app directory in the container
COPY . /app

# Set the working directory to /app
WORKDIR /app

# Clear npm cache and remove node_modules directory
RUN rm -rf node_modules \
    && npm cache clean --force

# Installs the DMS Lite packages
RUN npm install

# Expose port 5345
EXPOSE 5345

# ENTRYPOINT [ "node", "app.js" ]
ENTRYPOINT ["npm", "start"]
