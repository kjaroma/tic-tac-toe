FROM node:20-alpine as reactbuilder

WORKDIR /app

RUN pwd

COPY ./client/package.json .
COPY ./client/package-lock.json .
COPY ./client/tsconfig.json .
COPY ./client/tailwind.config.js .

RUN npm ci

COPY ./client/src ./src 
COPY ./client/public ./public 

RUN npm run build --production

# build web server
FROM node:20-alpine as apibuilder
WORKDIR /app

COPY ./server/package.json .
COPY ./server/package-lock.json .
COPY ./server/tsconfig.json .

RUN npm ci

COPY ./server .
RUN ls -al .

# format lint and test 
FROM apibuilder as quality
WORKDIR /app
RUN npm run format && npm run lint 
# && npm test - some jest config issue

# build project
FROM quality as builder
WORKDIR /app
RUN npm run build --omit=dev


FROM node:20-alpine
WORKDIR /app

COPY ./server/package*.json ./
COPY ./server/prisma ./prisma
COPY ./server/.env .
RUN npm install --omit=dev

COPY --from=builder /app/dist/src .
COPY --from=reactbuilder /app/build ./public

# CMD ["sleep", "3600"]
CMD ["npm", "run", "start:migrate"]
