FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN mkdir ~/.npm-global
RUN npm config set prefix '~/.npm-global'
ENV NPM_CONFIG_PREFIX ~/.npm-global
RUN npm install --only=production
# Bundle app source
COPY . .

RUN npm i preact-cli
RUN ./node_modules/.bin/preact build --no-prerender

EXPOSE 80 443
CMD [ "node", "server.js" ]
