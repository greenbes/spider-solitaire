# This list
default:
  @just --list --justfile {{justfile()}}

# Build and deploy application to S3
deploy:
  #!/usr/bin/env bash
  set -euo pipefail
  if [[ -z "${S3_BUCKET:-}" ]]; then
    echo "Error: S3_BUCKET environment variable is not set"
    exit 1
  fi
  echo "Building..."
  npm run build
  echo "Deploying to s3://${S3_BUCKET}..."
  aws s3 sync dist/ "s3://${S3_BUCKET}/" --delete
  aws s3 cp errors.html "s3://${S3_BUCKET}/errors.html"
  echo "Deploy complete"
