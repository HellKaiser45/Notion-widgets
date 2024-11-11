#!/bin/bash

# Sitemap generator script

# Use SITE_ORIGIN if set, otherwise default
BASE_URL="${SITE_ORIGIN}"

# Output sitemap file
SITEMAP_FILE="/var/www/html/sitemap.xml"

# Ensure the directory exists
mkdir -p /var/www/html

# Start the sitemap XML
echo '<?xml version="1.0" encoding="UTF-8"?>' > "$SITEMAP_FILE"
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> "$SITEMAP_FILE"

# Function to add URL to sitemap
add_url() {
    local path="$1"
    local priority="${2:-0.5}"
    local changefreq="${3:-weekly}"

    echo "  <url>" >> "$SITEMAP_FILE"
    echo "    <loc>${BASE_URL}${path}</loc>" >> "$SITEMAP_FILE"
    echo "    <lastmod>$(date -I)</lastmod>" >> "$SITEMAP_FILE"
    echo "    <changefreq>${changefreq}</changefreq>" >> "$SITEMAP_FILE"
    echo "    <priority>${priority}</priority>" >> "$SITEMAP_FILE"
    echo "  </url>" >> "$SITEMAP_FILE"
}

# Add known paths
add_url "/" 1.0
add_url "/index.html" 0.9
add_url "/ui/" 0.8

# Find and add all HTML files
find /var/www/html -name "*.html" | while read -r file; do
    # Remove the base path to get relative path
    relative_path="${file#/var/www/html}"
    # Exclude some paths if needed
    if [[ ! "$relative_path" =~ ^/private/ && ! "$relative_path" =~ ^/admin/ ]]; then
        add_url "$relative_path"
    fi
done

# Close the sitemap XML
echo '</urlset>' >> "$SITEMAP_FILE"

# Make the sitemap readable
chmod 644 "$SITEMAP_FILE"

echo "Sitemap generated at $SITEMAP_FILE"
