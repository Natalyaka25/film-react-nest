FROM node:18-alpine AS build

WORKDIR /app

ARG VITE_API_URL=/api/afisha
ARG VITE_CDN_URL=/content/afisha

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM alpine:3.20 AS production

COPY --from=build /app/dist /app/dist
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

VOLUME ["/usr/share/nginx/html"]

ENTRYPOINT ["sh", "/docker-entrypoint.sh"]
