#!/bin/sh
set -e

# Default to localhost if SITE_ORIGIN is not set
SITE_ORIGIN=${SITE_ORIGIN}

# Build the project using the provided SITE_ORIGIN
export SITE_ORIGIN
bun run build.client
bun run build.server

# Prepare nginx configuration
envsubst '$SITE_ORIGIN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Copy built files to nginx directory
rm -rf /var/www/html/*
rm -rf /etc/nginx/conf.d/default.conf.tenplate
cp -r dist/* /var/www/html/

# Start nginx
exec nginx -g "daemon off;"
