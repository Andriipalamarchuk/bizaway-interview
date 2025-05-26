# ----------- Build Phase ------------
FROM node:22.11.0-alpine3.20 AS build
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

# ----------- Runtime Phase ----------
FROM node:22.11.0-alpine3.20 AS run
WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "dist/main.js"]
