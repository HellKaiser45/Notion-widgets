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
    /usr/local/bin/variable-replace.sh /etc/nginx/nginx.conf
    /usr/local/bin/variable-replace.sh /var/www/html/
    generate_sitemap

    log "Starting nginx in foreground"
    exec nginx -g "daemon off;"
}

# Run the main function
main
