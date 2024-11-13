# syntax=docker/dockerfile:1.2
FROM ubuntu:latest

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install required dependencies
RUN apt-get update && apt-get install -y \
  nginx \
  python3 \
  python3-pip \
  python3-requests \
  python3-bs4 \
  gettext \
  curl \
  cron \
  && rm -rf /var/lib/apt/lists/*

# Install additional Python dependencies if needed
# Use --break-system-packages with caution
RUN pip3 install --break-system-packages --no-cache-dir \
  requests \
  beautifulsoup4

# Copy nginx configuration template
COPY scripts/sitemap_generator.py /usr/local/bin/
COPY scripts/entrypoint.sh /usr/local/bin/
COPY config/nginx/my-nginx.conf /etc/nginx/conf.d/default.conf.template
COPY src/ /tmp/project/src/

# Create web root and set permissions
RUN mkdir -p /var/www/html && \
  chmod +x /usr/local/bin/entrypoint.sh && \
  chmod +x /usr/local/bin/sitemap_generator.py

ENV PYTHONUNBUFFERED=1

# Expose port 80
EXPOSE 80

# Use the custom entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
