FROM nginx:alpine

RUN apk add --no-cache \
  gettext \
  bash \
  python3 \
  py3-pip \
  dcron \
  curl && \
  pip3 install --no-cache-dir --break-system-packages requests beautifulsoup4

# Copy nginx configuration template
COPY scripts/sitemap_generator.py /usr/local/bin/
COPY scripts/entrypoint.sh /usr/local/bin/
COPY config/nginx/my-nginx.conf /etc/nginx/conf.d/default.conf.template
COPY src/ /tmp/project/src/

RUN mkdir -p /var/www/html && \
  chmod +x /usr/local/bin/entrypoint.sh && \
  chmod +x /usr/local/bin/sitemap_generator.py

ENV PYTHONUNBUFFERED=1

# Expose port 80
EXPOSE 80

# Use the custom entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
