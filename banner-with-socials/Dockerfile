# syntax=docker/dockerfile:1.2
FROM node:22.11 AS builder

RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

ARG SITE_ORIGIN=localhost
ENV SITE_ORIGIN=$SITE_ORIGIN

WORKDIR /app
COPY . .

# RUN echo "SITE_ORIGIN=$SITE_ORIGIN" > .env
RUN bun install
RUN bun run build.client
RUN bun run build.server

FROM nginx:alpine

ARG SITE_ORIGIN=localhost
ENV SITE_ORIGIN=$SITE_ORIGIN

RUN rm -rf /var/www/html/*
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /var/www/html/
COPY --from=builder /app/my-nginx.conf /etc/nginx/conf.d/default.conf.template

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Use envsubst to substitute the SITE_ORIGIN environment variable
RUN envsubst '$SITE_ORIGIN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

RUN rm /etc/nginx/conf.d/default.conf.template

CMD ["nginx", "-g", "daemon off;"]
