FROM node:18-alpine as deps
WORKDIR /app
COPY package.json ./
RUN yarn

FROM node:18-alpine as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .envProd ./.env
RUN cat .env
RUN yarn build

FROM node:18-alpine as start
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env
RUN cat .env
EXPOSE 4000
CMD ["node", "/app/dist/main.js"]
