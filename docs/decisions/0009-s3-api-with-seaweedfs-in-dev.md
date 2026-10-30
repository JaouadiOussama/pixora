# 0009. S3 API for photo storage, SeaweedFS in dev

- Status: Accepted
- Date: 2026-10-30

## Context

post-service stores photos (v1: 1–10 per post). The browser should upload directly to storage with presigned URLs instead of streaming files through the gateway and services. We need an S3-compatible store that runs in Docker on the dev laptop.

MinIO, the usual choice, is no longer an option: its open-source edition went into maintenance mode in December 2025, stopped publishing official builds, and its repository was archived on 2026-04-25.

## Decision

- **The code only talks to the S3 API**, through the AWS SDK for Java v2 (`S3Client`, `S3Presigner`). The endpoint, region, keys and bucket names are configuration. No product-specific API is used.
- **Dev and tests: SeaweedFS** (Apache 2.0), one container running `weed server -s3`. It supports presigned URLs and bucket CORS.
- **Fallback: Garage**, if SeaweedFS fails on something we need.
- **Production store: decided in D8.** A managed S3 service (for example Cloudflare R2, which has no egress fees) is the likely choice.
- **The first post-service task is a spike** that proves a presigned PUT from the browser works with CORS on SeaweedFS.
- Two buckets: `uploads` (private, temporary) and `media` (processed photos, served through the gateway).

The full upload workflow is in [media.md](../media.md).

## Consequences

- Changing the store (SeaweedFS → Garage, AWS S3, R2) means changing configuration, not code.
- Uploads don't go through our services, so they don't use their memory or bandwidth.
- The `uploads` bucket needs CORS for the app's origin, because the browser uploads to it directly.
- We rely only on common S3 features (put, get, head, delete, presign, CORS), where S3-compatible stores agree. We don't rely on lifecycle rules; a scheduled job does the cleanup.

## Alternatives considered

- **MinIO:** archived open-source edition, no official builds. Rejected.
- **Garage:** light and active, but needs a cluster layout and key setup step, and a CORS header bug was fixed only in April 2026. Kept as the fallback.
- **RustFS:** too young.
- **Storing files in PostgreSQL or on the service's disk:** doesn't scale, and makes services stateful.
- **Uploading through post-service:** simpler CORS, but every photo would pass through the gateway and the service.
