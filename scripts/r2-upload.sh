#!/bin/bash
# Simple curl-style upload to R2 using AWS CLI
# This is the most reliable method

FILE="$1"
KEY="$2"

if [ -z "$FILE" ] || [ -z "$KEY" ]; then
    echo "Usage: $0 <file-path> <s3-key>"
    echo "Example: $0 public/assets/images/spieler-avatars/player.png avatars/player.png"
    exit 1
fi

if [ ! -f "$FILE" ]; then
    echo "Error: File '$FILE' not found"
    exit 1
fi

# R2 Configuration
BUCKET="video"
ENDPOINT="https://c0c75bed291bceef83d24c94aae2b233.r2.cloudflarestorage.com"
ACCESS_KEY="c6c28fea31ea86d4ddf6d63f841af283"
SECRET_KEY="9fe5d5ac5d9cdee6e4aa232d30e6af8ec07c7cbb93abd78d0402aa5fd99048d5"

# Get content type
case "${FILE##*.}" in
    png) CONTENT_TYPE="image/png" ;;
    jpg|jpeg) CONTENT_TYPE="image/jpeg" ;;
    gif) CONTENT_TYPE="image/gif" ;;
    webp) CONTENT_TYPE="image/webp" ;;
    svg) CONTENT_TYPE="image/svg+xml" ;;
    *) CONTENT_TYPE="application/octet-stream" ;;
esac

echo "🚀 Uploading: $FILE"
echo "📍 Destination: s3://$BUCKET/$KEY"
echo "📄 Content-Type: $CONTENT_TYPE"
echo ""

# Upload using AWS CLI (which uses curl internally)
AWS_ACCESS_KEY_ID="$ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$SECRET_KEY" \
aws s3 cp "$FILE" "s3://$BUCKET/$KEY" \
    --endpoint-url "$ENDPOINT" \
    --content-type "$CONTENT_TYPE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Upload successful!"
    echo "🌐 Public URL: $ENDPOINT/$BUCKET/$KEY"
    echo ""
    echo "📋 To access via curl (GET):"
    echo "curl '$ENDPOINT/$BUCKET/$KEY'"
else
    echo ""
    echo "❌ Upload failed!"
    exit 1
fi