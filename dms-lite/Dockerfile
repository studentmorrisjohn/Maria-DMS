FROM node:lts-slim

COPY . .

# Installs the DMS Lite packages
RUN npm install

#port in which App is running at Localhost:3000
EXPOSE 5345

# ENTRYPOINT [ "node", "app.js" ]
ENTRYPOINT ["npm", "start"]
