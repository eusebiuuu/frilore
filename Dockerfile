FROM node:18.2.0-alpine

WORKDIR /app

COPY package*.json ./

# RUN npm cache clean --force && npm install -g typescript

# COPY client/package*.json client/
# RUN npm ci --prefix client --omit=dev

COPY server/package*.json server/
RUN npm install --prefix server --omit=dev

# COPY client/ client/
# RUN npm run build --prefix client

COPY server/ server/

USER node

CMD [ "npm", "run", "start" ]

EXPOSE 8000