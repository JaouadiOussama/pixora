# 0006. Keycloak with the gateway as a BFF

- Status: Accepted
- Date: 2026-10-30

## Context

Pixora needs sign-up, login, logout and forgot password for v1, and Google login and two-factor authentication later. The frontend is an Angular SPA. Current guidance for browser-based OAuth apps recommends not keeping tokens in the browser, because any XSS bug could steal them, including long-lived refresh tokens.

## Decision

- **Keycloak** is the identity provider (realm `pixora`). The realm is kept as code in the hub and imported automatically at startup. Login pages use a Pixora theme.
- The **gateway is a BFF** (Backend For Frontend): a confidential OIDC client (`oauth2Login`, authorization code flow with PKCE) that keeps the tokens in a **server-side session stored in Redis** (Spring Session). The browser only gets an **httpOnly session cookie**.
- The gateway forwards requests to services with the access token (`TokenRelay`) and removes the `Cookie` header.
- **CSRF protection is on** (cookie-to-header, which Angular's `HttpClient` supports natively). The app and the API share one origin, so no CORS is needed.
- Services are **stateless JWT resource servers** that check signature, issuer, audience (`pixora-api`) and expiry.
- **user-service creates the profile on the first authenticated request**, idempotently, from the JWT claims. There is no separate "create profile" step.
- **Logout is RP-initiated:** the gateway ends its session and the Keycloak session.
- v1: sign-up, login, logout, forgot password (Mailpit catches emails in dev). Later: Google login, 2FA.

The full workflow is in [authentication.md](../authentication.md).

## Consequences

- Tokens never reach the browser; the Angular app has no token-handling code.
- The gateway is stateful and depends on Redis.
- Angular can't read user info from a token, so it calls `/api/me`.
- Login and logout are full-page navigations, not `HttpClient` calls.
- A future mobile app needs its own public Keycloak client with PKCE.

## Alternatives considered

- **Angular as a public client with PKCE, tokens in the browser:** simpler, but exposes tokens to XSS. Rejected for security.
- **Our own auth-service (Spring Security + JWT):** more code to write and secure (password storage, reset emails, brute-force protection, 2FA later), with more risk. Rejected.
