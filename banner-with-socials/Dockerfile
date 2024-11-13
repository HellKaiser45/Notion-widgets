# syntax=docker/dockerfile:1.2
FROM ubuntu:latest

# Update and install necessary tools
RUN apt-get update && \
  apt-get install -y \
  curl \
  nginx \
  gettext-base \
  unzip \
  python3 \
  python3-pip \
  dcron && \
  pip3 install --no-cache-dir --break-system-packages requests beautifulsoup4

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

# Install dependencies (but do not build)
RUN bun install

# Copy scripts and set permissions
COPY scripts/entrypoint.sh /entrypoint.sh
COPY scripts/sitemap_generator.py /usr/local/bin/sitemap_generator.py
RUN chmod +x /entrypoint.sh /usr/local/bin/sitemap_generator.py

# Prepare nginx configuration template
COPY config/nginx/my-nginx.conf /etc/nginx/conf.d/default.conf.template

# Set environment variables for Python
ENV PYTHONUNBUFFERED=1

# Expose web port
EXPOSE 80

# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]
