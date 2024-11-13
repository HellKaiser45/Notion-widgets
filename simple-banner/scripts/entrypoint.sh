#!/bin/sh
set -e

# Enhanced logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

# Validate SITE_ORIGIN
if [ -z "$SITE_ORIGIN" ]; then
    log "Error: SITE_ORIGIN environment variable must be set"
    exit 1
fi

# Provide defaults for sitemap-related variables
export SITE_ORIGIN
export SITEMAP_PATH=${SITEMAP_PATH:-"/var/www/html/sitemap.xml"}
export SITEMAP_FREQUENCY=${SITEMAP_FREQUENCY:-"daily"}
export SITEMAP_PRIORITY=${SITEMAP_PRIORITY:-"0.8"}
export SITEMAP_EXCLUDE_PATHS=${SITEMAP_EXCLUDE_PATHS:-"/admin/,/login/,/private/"}
export SITEMAP_EXCLUDE_EXTENSIONS=${SITEMAP_EXCLUDE_EXTENSIONS:-".pdf,.jpg,.png,.gif"}
export SITEMAP_TIMEOUT=${SITEMAP_TIMEOUT:-"10"}
export SITEMAP_USER_AGENT=${SITEMAP_USER_AGENT:-"SitemapGenerator/1.0"}

# Prepare nginx configuration
log "Preparing nginx configuration"
envsubst '$SITE_ORIGIN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Prepare web root
log "Preparing web root"
rm -rf /var/www/html/*
rm -rf /etc/nginx/conf.d/default.conf.template
cp -rv /tmp/project/src/* /var/www/html/

# Handle robots.txt template
if [ -f "/var/www/html/robots.txt.template" ]; then
    log "Processing robots.txt template"
    envsubst '$SITE_ORIGIN' < /var/www/html/robots.txt.template > /var/www/html/robots.txt
    rm /var/www/html/robots.txt.template
fi

# Ensure correct permissions
log "Setting file permissions"
chmod -R 755 /var/www/html
chmod +x /usr/local/bin/sitemap_generator.py

# Graceful nginx configuration check
log "Checking nginx configuration"
nginx -t || {
    log "ERROR: Nginx configuration test failed"
    exit 1
}

# Start nginx in background for initial setup
log "Starting nginx in background"
nginx

# Wait briefly to ensure nginx starts
sleep 2

# Setup cron job for sitemap generation
log "Setting up cron job for sitemap generation"
echo "0 0 * * * python3 /usr/local/bin/sitemap_generator.py" > /etc/cron.d/sitemap-generator
chmod 0644 /etc/cron.d/sitemap-generator

# Start cron
log "Starting cron"
cron

# Generate initial sitemap
log "Generating initial sitemap"
python3 /usr/local/bin/sitemap_generator.py || {
    log "ERROR: Sitemap generation failed"
    exit 1
}

# Gracefully stop background nginx
log "Stopping background nginx"
nginx -s quit

# Wait a moment to ensure clean shutdown
sleep 2

# Start nginx in foreground
log "Starting nginx in foreground"
exec nginx -g "daemon off;"
