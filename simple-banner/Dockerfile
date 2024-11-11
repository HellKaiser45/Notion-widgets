FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext bash

# Copy project files
COPY . /tmp/project/

# Copy nginx configuration template
COPY config/nginx/my-nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy sitemap generation script
COPY scripts/generate_sitemap.sh /generate_sitemap.sh
RUN chmod +x /generate_sitemap.sh

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 80
EXPOSE 80

# Use the custom entrypoint
ENTRYPOINT ["/entrypoint.sh"]
