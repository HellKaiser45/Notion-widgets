# syntax=docker/dockerfile:1.2

# Stage 1: Build Stage with Node.js
FROM node:16-alpine AS builder

# Copy the project files to the build context
COPY . .

# Install Tailwind CLI
RUN npm install

# Build the CSS using Tailwind
RUN npm run build:css

# Stage 2: Production Stage with Python and Nginx
FROM python:3.10-alpine AS production

# Install necessary packages
RUN apk add --no-cache nginx curl gettext && \
  pip install requests beautifulsoup4

# Create the web root directory
RUN mkdir -p /var/www/html

# Copy static assets and compiled CSS from the builder stage
COPY --from=builder src/ /tmp/project/src/

# Copy scripts and configuration
COPY --from=builder /scripts/sitemap_generator.py /usr/local/bin/
COPY --from=builder /scripts/entrypoint.sh /usr/local/bin/
COPY --from=builder /config/nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Set permissions for executables and web root
RUN chmod +x /usr/local/bin/entrypoint.sh && \
  chmod +x /usr/local/bin/sitemap_generator.py && \
  chmod -R 755 /var/www/html


# Expose the default HTTP port
EXPOSE 80

# Start Nginx and cron in the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
