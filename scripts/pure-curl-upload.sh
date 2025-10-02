#!/bin/bash
# Pure curl upload example (requires aws-cli for signature generation)
# This demonstrates how to use raw curl for R2 uploads

FILE="$1"
KEY="$2"
BUCKET="video"
ENDPOINT="https://c0c75bed291bceef83d24c94aae2b233.r2.cloudflarestorage.com"

if [ -z "$FILE" ] || [ -z "$KEY" ]; then
    echo "Usage: $0 <file-path> <s3-key>"
    echo "Example: $0 public/assets/images/spieler-avatars/player.png avatars/player.png"
    exit 1
fi

# Generate presigned URL using AWS CLI, then use curl  
echo "Generating presigned URL..."
PRESIGNED_URL=$(AWS_ACCESS_KEY_ID="c6c28fea31ea86d4ddf6d63f841af283" \
AWS_SECRET_ACCESS_KEY="9fe5d5ac5d9cdee6e4aa232d30e6af8ec07c7cbb93abd78d0402aa5fd99048d5" \
aws s3 presign "s3://$BUCKET/$KEY" \
    --endpoint-url "$ENDPOINT" \
    --expires-in 3600)

if [ $? -ne 0 ]; then
    echo "Failed to generate presigned URL"
    exit 1
fi

# Get content type
case "${FILE##*.}" in
    png) CONTENT_TYPE="image/png" ;;
    jpg|jpeg) CONTENT_TYPE="image/jpeg" ;;
    gif) CONTENT_TYPE="image/gif" ;;
    webp) CONTENT_TYPE="image/webp" ;;
    svg) CONTENT_TYPE="image/svg+xml" ;;
    *) CONTENT_TYPE="application/octet-stream" ;;
esac

echo "Uploading $FILE to $BUCKET/$KEY using curl..."

# Upload using curl with presigned URL
curl -X PUT \
    -H "Content-Type: $CONTENT_TYPE" \
    --data-binary "@$FILE" \
    --progress-bar \
    "$PRESIGNED_URL"

if [ $? -eq 0 ]; then
    echo -e "\n✅ Upload successful!"
    echo "File available at: $ENDPOINT/$BUCKET/$KEY"
else
    echo -e "\n❌ Upload failed!"
    exit 1
fi