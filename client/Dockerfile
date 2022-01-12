FROM node:16-alpine

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

# Add the following line due to CRA bug 
ENV CI=true

CMD ["npm", "start"]