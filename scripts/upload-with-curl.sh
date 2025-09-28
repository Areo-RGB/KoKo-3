#!/bin/bash
# Upload image to R2 using curl with AWS signature
# Usage: ./upload-with-curl.sh <local-file-path> <r2-key>
# Example: ./upload-with-curl.sh public/assets/images/spieler-avatars/eray.png avatars/eray.png

if [ $# -ne 2 ]; then
    echo "Usage: $0 <local-file-path> <r2-key>"
    echo "Example: $0 public/assets/images/spieler-avatars/eray.png avatars/eray.png"
    exit 1
fi

LOCAL_FILE="$1"
R2_KEY="$2"

# R2 Configuration
BUCKET="video"
ACCESS_KEY="c6c28fea31ea86d4ddf6d63f841af283"
SECRET_KEY="9fe5d5ac5d9cdee6e4aa232d30e6af8ec07c7cbb93abd78d0402aa5fd99048d5"
ENDPOINT="https://c0c75bed291bceef83d24c94aae2b233.r2.cloudflarestorage.com"
REGION="auto"

# Check if file exists
if [ ! -f "$LOCAL_FILE" ]; then
    echo "Error: File '$LOCAL_FILE' not found"
    exit 1
fi

# Get file content type based on extension
case "${LOCAL_FILE##*.}" in
    png) CONTENT_TYPE="image/png" ;;
    jpg|jpeg) CONTENT_TYPE="image/jpeg" ;;
    gif) CONTENT_TYPE="image/gif" ;;
    webp) CONTENT_TYPE="image/webp" ;;
    svg) CONTENT_TYPE="image/svg+xml" ;;
    *) CONTENT_TYPE="application/octet-stream" ;;
esac

echo "Uploading $LOCAL_FILE to s3://$BUCKET/$R2_KEY"
echo "Content-Type: $CONTENT_TYPE"

# Use AWS CLI with curl-like output
AWS_ACCESS_KEY_ID="$ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$SECRET_KEY" \
aws s3 cp "$LOCAL_FILE" "s3://$BUCKET/$R2_KEY" \
    --endpoint-url "$ENDPOINT" \
    --content-type "$CONTENT_TYPE" \
    --no-progress

echo "Upload completed!"
echo "File available at: $ENDPOINT/$BUCKET/$R2_KEY"