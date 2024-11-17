# syntax=docker/dockerfile:1.2

# Stage 1: Build Stage with Node.js
FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install Tailwind CLI
RUN npm install

# Copy the project files to the build context
COPY . .

# Build the CSS using Tailwind
RUN npm run build:css

# Stage 2: Production Stage with Python and Nginx
FROM python:3.10-alpine AS production

# Install necessary packages
RUN apk add --no-cache nginx curl gettext moreutils bash && \
  pip install requests beautifulsoup4

# Create the web root directory
RUN rm -rf /var/www/html/*

# Copy static assets and compiled CSS from the builder stage
COPY --from=builder /app/src/ /var/www/html/

# Copy scripts and configuration
COPY --from=builder /app/scripts/sitemap_generator.py /usr/local/bin/
COPY --from=builder /app/scripts/entrypoint.sh /usr/local/bin/
COPY --from=builder /app/scripts/variable-replace.sh /usr/local/bin/
COPY --from=builder /app/config/nginx.conf /etc/nginx/conf.d/default.conf

# Set permissions for executables and web root
RUN chmod +x /usr/local/bin/entrypoint.sh && \
  chmod +x /usr/local/bin/variable-replace.sh && \
  chmod +x /usr/local/bin/sitemap_generator.py && \
  chmod -R 755 /var/www/html

# Expose the default HTTP port
EXPOSE 80

# Start Nginx and cron in the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
