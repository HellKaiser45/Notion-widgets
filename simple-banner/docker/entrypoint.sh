#!/bin/sh
set -e

# Ensure SITE_ORIGIN is set, exit if not provided
if [ -z "$SITE_ORIGIN" ]; then
    echo "Error: SITE_ORIGIN environment variable must be set"
    exit 1
fi

# Export for use in other scripts
export SITE_ORIGIN

# Prepare nginx configuration
envsubst '$SITE_ORIGIN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Copy project files to nginx directory
rm -rf /var/www/html/*
rm -rf /etc/nginx/conf.d/default.conf.template

# Ensure web root exists
mkdir -p /var/www/html

# Copy ALL contents of src directly to web root
cp -r /tmp/project/src/* /var/www/html/

# Ensure correct permissions
chmod -R 755 /var/www/html

# Generate sitemap
/generate_sitemap.sh

# Print contents of web root for debugging
echo "Web root contents:"
ls -la /var/www/html

# Start nginx
exec nginx -g "daemon off;"
