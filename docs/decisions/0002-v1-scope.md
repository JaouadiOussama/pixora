# 0002. v1 scope

- Status: Accepted
- Date: 2026-10-29

## Context

Pixora follows the "Design Instagram" system-design case study. The full product is far too large for a first version, so v1 must cover the core loop (post, follow, see a feed, react) and leave the rest for later.

## Decision

v1 features, built in this order:

1. **Authentication** (the pilot): sign-up, login, logout, forgot password.
2. **Profile.**
3. **Follow / unfollow.**
4. **Photo posts:** 1–10 photos, caption, hashtags, direct upload with presigned URLs.
5. **Home feed:** fan-out on write first; a pull path for very popular accounts is a later task.
6. **Likes and comments.**
7. **Search:** username autocomplete and hashtags.

v2: videos, shares, in-app notifications.

Out of scope: direct messages, Reels, push notifications, Stories, recommendations.

## Consequences

- The pilot (authentication) exercises the whole toolchain (gateway, Keycloak, Redis, a service, the Angular app, CI) on a small feature.
- Later features can rely on authentication and profiles existing.

## Alternatives considered

- **Feed before follow:** a feed has nothing to show without a follow graph.
- **Including videos in v1:** needs transcoding and much more storage; moved to v2.
