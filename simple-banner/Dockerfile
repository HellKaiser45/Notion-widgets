# syntax=docker/dockerfile:1.2
FROM ubuntu:latest

# Update and install necessary tools
RUN apt-get update && \
  apt-get install -y \
  curl \
  nginx


WORKDIR /app

# Copy project files
COPY . .

# Create an entrypoint script to handle nginx configuration
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Prepare nginx configuration template
COPY my-nginx.conf /etc/nginx/conf.d/default.conf.template

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
