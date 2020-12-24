FROM node:14
WORKDIR /app

COPY src ./src
ENTRYPOINT ["node", "/app/src/index.js"]
