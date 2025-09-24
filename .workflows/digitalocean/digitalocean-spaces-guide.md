# DigitalOcean Spaces Upload Guide Using AWS CLI

This guide explains how to set up and use the AWS CLI to upload files to DigitalOcean (DO) Spaces, which is an S3-compatible object storage service. DO Spaces allows you to store and serve files (images, videos, etc.) via HTTP, similar to AWS S3. All commands use AWS CLI v2, configured for DO's endpoint.

## Prerequisites

- AWS CLI v2 installed ([download here](https://aws.amazon.com/cli/)).
- A DigitalOcean account with Spaces enabled ([create Spaces](https://cloud.digitalocean.com/spaces)).
- DO Spaces details (from DO Dashboard > API > Spaces):
  - **Space Name**: e.g., `my-space` (bucket name).
  - **Endpoint**: Regional URL, e.g., `https://fra1.digitaloceanspaces.com` (Frankfurt region; choose yours).
  - **Access Key** and **Secret Key**: Generate in DO Dashboard > API > Spaces Keys (like AWS IAM keys).
- Test file: Use `public/favicon.ico` from the project.

**Security Note**: Keep keys secret; use IAM-like policies in DO for least privilege.

## Step 1: Install AWS CLI (if not installed)

On Windows (via MSI installer) or via command:

```bash
# Windows (PowerShell as Admin)
winget install -e --id Amazon.AWSCLI

# Verify
aws --version
```

## Step 2: Configure AWS CLI for DO Spaces

Use `aws configure` to set credentials and default region (DO uses custom endpoint, so override per command or profile).

Create a profile for DO (recommended):

```bash
aws configure --profile do-spaces
```

Enter:
- **AWS Access Key ID**: Your DO Spaces Access Key (e.g., `DO00XXXXXXX`).
- **AWS Secret Access Key**: Your DO Spaces Secret Key.
- **Default region name**: Your Space's region (e.g., `fra1` for Frankfurt).
- **Default output format**: `json` (optional).

This creates `~/.aws/credentials` and `~/.aws/config` with the profile.

**Full Config Example** (manual edit if needed):
- `~/.aws/credentials`:
  ```
  [do-spaces]
  aws_access_key_id = YOUR_ACCESS_KEY
  aws_secret_access_key = YOUR_SECRET_KEY
  ```
- `~/.aws/config`:
  ```
  [profile do-spaces]
  region = fra1
  output = json
  ```

## Step 3: Uploading Files

DO Spaces uses `aws s3` commands with `--endpoint-url` for the custom endpoint.

### Basic Upload (Local File)
Upload `public/favicon.ico` to root of Space `my-space`:

```bash
aws s3 cp public/favicon.ico s3://my-space/ --endpoint-url https://fra1.digitaloceanspaces.com --profile do-spaces
```

- **To Specific Folder**: `s3://my-space/uploads/favicon.ico`.
- **Public ACL** (for web access): Add `--acl public-read`.
- **From URL**: Use `aws s3 cp https://example.com/image.jpg s3://my-space/ ...`.

### Batch Upload (Directory)
Upload entire `public/images/`:

```bash
aws s3 sync public/images/ s3://my-space/images/ --endpoint-url https://fra1.digitaloceanspaces.com --profile do-spaces --acl public-read
```

### Advanced Options
- **Metadata**: `--metadata-directive REPLACE --content-type image/png --metadata '{"key":"value"}'`.
- **Dry Run**: Add `--dryrun` to preview.
- **Delete After Upload**: `aws s3 cp file s3://bucket/ --endpoint-url ... && rm file`.
- **CORS**: Configure in DO Dashboard for web access.
- **CDN**: Enable DO CDN for faster delivery (add to endpoint).

Full AWS S3 CLI reference: [AWS Docs](https://docs.aws.amazon.com/cli/latest/reference/s3/).

## Step 4: Verification and Management

- **List Objects**: 
  ```bash
  aws s3 ls s3://my-space/ --endpoint-url https://fra1.digitaloceanspaces.com --profile do-spaces
  ```
- **Download**:
  ```bash
  aws s3 cp s3://my-space/favicon.ico ./downloaded.ico --endpoint-url https://fra1.digitaloceanspaces.com --profile do-spaces
  ```
- **Delete**:
  ```bash
  aws s3 rm s3://my-space/favicon.ico --endpoint-url https://fra1.digitaloceanspaces.com --profile do-spaces
  ```
- **Access URL**: Files are public if ACL set: `https://my-space.fra1.digitaloceanspaces.com/favicon.ico`.
- **DO Dashboard**: View/manage in DO Control Panel > Spaces.

## Testing Upload

To test, run the basic upload command above with your details. Expected success: "upload: public/favicon.ico to s3://my-space/favicon.ico".

If errors:
- **NoSuchBucket**: Wrong Space name/endpoint.
- **AccessDenied**: Invalid keys or permissions.
- **SignatureDoesNotMatch**: Wrong secret or endpoint.

## Troubleshooting

- **Endpoint**: Must match your Space's region (e.g., nyc3, fra1). List: [DO Regions](https://docs.digitalocean.com/products/spaces/details/regional-availability/).
- **Keys**: Regenerate if issues; ensure Spaces read/write permissions.
- **Profiles**: Use `--profile do-spaces` or set `AWS_PROFILE=do-spaces`.
- **Large Files**: AWS CLI handles multipart automatically (>5MB).
- **Costs**: DO Spaces: $5/month for 250GB; transfers extra.
- **Alternatives**: Use DO CLI (`doctl`) for Spaces: `doctl spaces cd my-space --access-key ...`.

For programmatic uploads (Node.js), use `aws-sdk` with DO endpoint.

Last Updated: 2025-09-23