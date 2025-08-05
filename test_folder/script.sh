#!/bin/bash

# Sample Shell Script
# This demonstrates basic shell scripting functionality

echo "Welcome to the Sample Shell Script!"
echo "Current date and time: $(date)"
echo "Current directory: $(pwd)"

# Display system information
echo ""
echo "System Information:"
echo "Hostname: $(hostname)"
echo "User: $(whoami)"
echo "OS: $(uname -s)"
echo "Kernel: $(uname -r)"

# Simple file operations
echo ""
echo "Creating a temporary file..."
echo "This is a test file" > temp.txt
echo "File created successfully!"

# Check if file exists
if [ -f "temp.txt" ]; then
    echo "File exists and contains:"
    cat temp.txt
fi

# Cleanup
rm -f temp.txt
echo "Temporary file cleaned up."

echo ""
echo "Script execution completed!"
