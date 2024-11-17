#!/bin/bash

replace_vars() {
    local target="$1"

    # Check if target exists
    if [ ! -e "$target" ]; then
        echo "Error: Target path '$target' does not exist"
        exit 1


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



replace_vars "$1"
