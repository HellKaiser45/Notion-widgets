#!/bin/sh
set -e

# Enhanced logging with color and timestamp
log() {
    local color="\033[0;34m"  # Blue color for info
    local reset="\033[0m"
    echo -e "${color}[$(date +'%Y-%m-%d %H:%M:%S')] $*${reset}" >&2
}

# Error logging with red color
error_log() {
    local color="\033[0;31m"  # Red color for errors
    local reset="\033[0m"
    echo -e "${color}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $*${reset}" >&2
}

# Validate critical environment variables
validate_env() {
    if [ -z "$SITE_ORIGIN" ]; then
        error_log "SITE_ORIGIN environment variable must be set"
        exit 1
    fi
}

# Prepare nginx configuration
prepare_nginx_config() {
    log "Preparing nginx configuration"
    rm -f /etc/nginx/nginx.conf

    # Use envsubst to replace environment variables in nginx config
    if ! envsubst '$SITE_ORIGIN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/nginx.conf; then
        error_log "Failed to generate nginx configuration"
        exit 1
    fi

    # Validate nginx configuration
    if ! nginx -t; then
        error_log "Nginx configuration test failed"
        exit 1
    fi
}

# Substitute site_origin in files using envsubst
substitute_site_origin() {
    local dir="$1"
    log "Substituting SITE_ORIGIN in files under $dir"

    # Prepare temporary directory for substitution
    mkdir -p /tmp/substitution

    # Find files to substitute
    find "$dir" -type f \( -name "*.html" -o -name "*.json" -o -name "*.txt" \) -print0 | while IFS= read -r -d '' file; do
        log "Processing $file"

        # Create a temporary file for substitution
        temp_file="/tmp/substitution/$(basename "$file")"
        cp "$file" "$temp_file"

        # Use envsubst to replace site origin
        envsubst '$SITE_ORIGIN' < "$temp_file" > "$file"
    done

    # Clean up temporary directory
    rm -rf /tmp/substitution
}

# Prepare web root
prepare_web_root() {
    log "Preparing web root"
    rm -rf /var/www/html/*
    rm -rf /etc/nginx/conf.d/default.conf.template
    cp -rv /tmp/project/src/* /var/www/html/

    # Substitute site_origin in web root
    substitute_site_origin /var/www/html

    # Ensure correct permissions
    chmod -R 755 /var/www/html
    chmod +x /usr/local/bin/sitemap_generator.py
}

# Generate sitemap
generate_sitemap() {
    log "Generating sitemap"
    if ! python3 /usr/local/bin/sitemap_generator.py; then
        error_log "Sitemap generation failed"
        exit 1
    fi
}

# Main entrypoint
main() {
    validate_env
    prepare_nginx_config
    prepare_web_root
    generate_sitemap

    log "Starting nginx in foreground"
    exec nginx -g "daemon off;"
}

# Run the main function
main
