# syntax=docker/dockerfile:1.2
FROM ubuntu:latest

# Update and install necessary tools
RUN apt-get update && \
  apt-get install -y \
  curl \
  nginx \
  gettext-base \
  unzip

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
  apt-get install -y nodejs

# Install bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Verify bun installation
RUN ln -s /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /app

# Copy project files
COPY . .

# Install dependencies and build
RUN bun install

# Create an entrypoint script to handle nginx configuration
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Prepare nginx configuration template
COPY my-nginx.conf /etc/nginx/conf.d/default.conf.template

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
