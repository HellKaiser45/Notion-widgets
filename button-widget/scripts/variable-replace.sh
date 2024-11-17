#!/bin/bash

replace_vars() {
    local target="$1"

    # Check if target exists
    if [ ! -e "$target" ]; then
        echo "Error: Target path '$target' does not exist"
        exit 1
    }

    # Install sponge if not available (part of moreutils)
    if ! command -v sponge &> /dev/null; then
        echo "Installing moreutils for sponge command..."
        sudo apt-get install -y moreutils || sudo yum install -y moreutils || brew install moreutils
    }

    # Process a single file
    process_file() {
        local file="$1"
        # Create backup
        cp "$file" "${file}.bak"
        # Replace variables
        envsubst < "$file" | sponge "$file"
        echo "Processed: $file"
    }

    # If target is a directory
    if [ -d "$target" ]; then
        find "$target" -type f -not -path "*/\.*" -print0 | while IFS= read -r -d '' file; do
            if [[ "$file" != *.bak ]]; then
                process_file "$file"
            fi
        done
    # If target is a file
    elif [ -f "$target" ]; then
        process_file "$target"
    fi
}

# Usage: ./script.sh path/to/target
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <target_path>"
    echo "Make sure environment variables are set before running"
    exit 1
fi

replace_vars "$1"
