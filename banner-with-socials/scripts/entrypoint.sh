#!/bin/sh
set -e

# Validate SITE_ORIGIN
if [ -z "$SITE_ORIGIN" ]; then
    echo "Error: SITE_ORIGIN environment variable must be set"
    exit 1
fi

# Provide defaults for other sitemap-related variables
export SITEMAP_PATH=${SITEMAP_PATH:-"/var/www/html/sitemap.xml"}
export SITEMAP_FREQUENCY=${SITEMAP_FREQUENCY:-"daily"}
export SITEMAP_PRIORITY=${SITEMAP_PRIORITY:-"0.8"}
export SITEMAP_EXCLUDE_PATHS=${SITEMAP_EXCLUDE_PATHS:-"/admin/,/login/,/private/"}
export SITEMAP_EXCLUDE_EXTENSIONS=${SITEMAP_EXCLUDE_EXTENSIONS:-".pdf,.jpg,.png,.gif"}
export SITEMAP_TIMEOUT=${SITEMAP_TIMEOUT:-"10"}
export SITEMAP_USER_AGENT=${SITEMAP_USER_AGENT:-"SitemapGenerator/1.0"}

# Build the project using the provided SITE_ORIGIN
bun run build.client
bun run build.server

# Prepare nginx configuration
envsubst '$SITE_ORIGIN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Prepare web root
rm -rf /var/www/html/*
cp -r dist/* /var/www/html/

# Handle robots.txt template
if [ -f "/app/public/robots.txt.template" ]; then
    envsubst '$SITE_ORIGIN' < /app/public/robots.txt.template > /var/www/html/robots.txt
fi

# Ensure correct permissions
chmod -R 755 /var/www/html

# Start nginx
exec nginx -g "daemon off;"

# Setup cron job for sitemap generation
echo "0 0 * * * /usr/local/bin/sitemap_generator.py" > /etc/cron.d/sitemap-generator
chmod 0644 /etc/cron.d/sitemap-generator

# Start cron
cron

# Generate initial sitemap
/usr/local/bin/sitemap_generator.py

# Print contents of web root for debugging
echo "Web root contents:"
ls -la /var/www/html
