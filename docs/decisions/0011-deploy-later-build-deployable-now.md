# 0011. Deploy later, build deployable images from the start

- Status: Accepted
- Date: 2026-10-30

## Context

A live demo is valuable for a portfolio project, but at the start there is nothing to show. The full system (7 services, Keycloak, Kafka, Elasticsearch, PostgreSQL, Redis, SeaweedFS, Jaeger) needs roughly 6–8 GB of RAM, so a tiny free server is not enough. The options checked on 2026-10-30:

- **Oracle Cloud Always Free, ARM:** reportedly reduced from 4 OCPU / 24 GB to 2 OCPU / 12 GB in mid-2026. Still enough, but idle free instances can be reclaimed, and free capacity is often unavailable.
- **Hetzner Cloud, ARM:** about €10.49/month for 8 GB (tight) or €20.99/month for 16 GB, plus IPv4, after the June 2026 price increase.

## Decision

- **No deployment now.**
- **Deploy at the feed milestone**, when authentication, profiles, photo posts and the home feed work end to end.
- **From stage 2, every repo produces deployable images:**
  - CI builds Docker images for **linux/amd64 and linux/arm64** and pushes them to **GitHub Container Registry**.
  - All configuration comes from **environment variables** (no environment-specific values in code or images).
  - The hub keeps a **production Compose file** next to the dev one.
- At the feed milestone, a new ADR decides: the host (Oracle Always Free if still viable, otherwise Hetzner), HTTPS and the domain, the production object store (SeaweedFS on the server or Cloudflare R2), and Docker Compose vs k3s.

The build and release workflow and the go-live checklist are in [deployment.md](../deployment.md).

## Consequences

- No hosting cost or server maintenance while the agents are building.
- Deployment problems (ARM images, configuration, secrets) are found early, because every merge already produces a deployable image.
- The demo link arrives later; the go-live checklist must be done before it is shared.

## Alternatives considered

- **Deploy now:** costs money or setup time and adds a public attack surface with nothing to show.
- **Deploy only at the end of v1:** risks finding deployment problems late, and delays the demo link.
- **amd64-only images:** simpler, but rules out the cheapest servers, which are ARM.
