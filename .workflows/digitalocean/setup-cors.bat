@echo off
setlocal

REM Configure AWS CLI profile for DigitalOcean Spaces
aws --profile do-tor1 configure set aws_access_key_id DO00WZ9FGAJ76M6PTA84
aws --profile do-tor1 configure set aws_secret_access_key CSg7foM2GlPg7a99ua7dcAqliOLZHXyx5iGyDG5TQQo
aws --profile do-tor1 configure set region fra1
aws --profile do-tor1 configure set default.s3.signature_version s3v4

REM Apply CORS from file (absolute Windows path)
set CORS_FILE=C:/Users/Anwender/Koko/.workflows/digitalocean/cors.json
aws --profile do-tor1 --endpoint-url https://fra1.digitaloceanspaces.com s3api put-bucket-cors --bucket data-h03 --cors-configuration file://%CORS_FILE%
if errorlevel 1 (
  echo File-based CORS failed. Trying inline JSON...
  aws --profile do-tor1 --endpoint-url https://fra1.digitaloceanspaces.com s3api put-bucket-cors --bucket data-h03 --cors-configuration '{"CORSRules":[{"AllowedOrigins":["*"],"AllowedMethods":["GET","HEAD","OPTIONS"],"AllowedHeaders":["*"],"ExposeHeaders":["ETag","Content-Length","Accept-Ranges","Content-Range","Content-Type"],"MaxAgeSeconds":3000}]}'
  if errorlevel 1 (
    echo Failed to set CORS.
    exit /b 1
  )
)

REM Verify CORS
aws --profile do-tor1 --endpoint-url https://fra1.digitaloceanspaces.com s3api get-bucket-cors --bucket data-h03
if errorlevel 1 (
  echo Failed to read back CORS.
  exit /b 1
)

echo Done.
exit /b 0
