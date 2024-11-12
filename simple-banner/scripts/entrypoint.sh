#!/bin/sh
set -e

# Ensure SITE_ORIGIN is set, exit if not provided
if [ -z "$SITE_ORIGIN" ]; then
    echo "Error: SITE_ORIGIN environment variable must be set"
    exit 1
fi

# Export all variables needed for the sitemap generator
export SITE_ORIGIN
export SITEMAP_PATH=${SITEMAP_PATH:-"/var/www/html/sitemap.xml"}
export SITEMAP_FREQUENCY=${SITEMAP_FREQUENCY:-"daily"}
export SITEMAP_PRIORITY=${SITEMAP_PRIORITY:-"0.8"}
export SITEMAP_EXCLUDE_PATHS=${SITEMAP_EXCLUDE_PATHS:-"/admin/,/login/,/private/"}
export SITEMAP_EXCLUDE_EXTENSIONS=${SITEMAP_EXCLUDE_EXTENSIONS:-".pdf,.jpg,.png,.gif"}
export SITEMAP_TIMEOUT=${SITEMAP_TIMEOUT:-"10"}
export SITEMAP_USER_AGENT=${SITEMAP_USER_AGENT:-"SitemapGenerator/1.0"}

# Prepare nginx configuration
envsubst '$SITE_ORIGIN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Clean up existing files
rm -rf /var/www/html/*
rm -rf /etc/nginx/conf.d/default.conf.template

# Copy ALL contents of src directly to web root
cp -r /tmp/project/src/* /var/www/html/

if [ -f "/var/www/html/robots.txt.template" ]; then
    envsubst '$SITE_ORIGIN' < /var/www/html/robots.txt.template > /var/www/html/robots.txt
    rm /var/www/html/robots.txt.template
fi

# Ensure correct permissions
chmod -R 755 /var/www/html

# Setup cron
echo "0 0 * * * /usr/local/bin/sitemap_generator.py" > /etc/crontabs/root
crond -b

# Generate initial sitemap
/usr/local/bin/sitemap_generator.py

# Print contents of web root for debugging
echo "Web root contents:"
ls -la /var/www/html

# Start nginx
exec nginx -g "daemon off;"
