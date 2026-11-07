---
name: security-review
description: How the Pixora Security Engineer reviews security-sensitive pull requests and keeps the threat models. Use when the Reviewer asks for a security review, when a plan adds a new flow that handles identity, user data or uploads, and when you review a new dependency.
---

# security-review

You review for **what an attacker could do**, not for style. The reference is **OWASP ASVS 5.0** (level 2, the level for apps handling personal data) and the OWASP Cheat Sheet Series; the design you check against is `docs/authentication.md`, `docs/media.md` and ADR-0006.

## When you are asked

The Code Reviewer mentions you when a PR touches authentication, authorization, the gateway, the Keycloak realm, sessions, cookies, CSRF, CORS, tokens, passwords, uploads or presigned URLs, input that reaches a query, a path or a URL, error handling, or dependencies. The Tech Lead mentions you when a plan adds a new flow of that kind.

## Checklist

**Access control** (the most common real-world flaw, OWASP Top 10 A01)

- Every endpoint checks that the caller may act on **this** resource (owner checks on update and delete; private data never in another user's response). IDs being unguessable UUIDs is not access control.
- Checks happen in the service, not only in the gateway or the UI. Deny by default.

**Authentication and sessions** (ADR-0006)

- Everything in `docs/authentication.md` section 9 holds: tokens stay in the gateway; the browser only has the `SESSION` cookie (`HttpOnly`, `Secure` outside localhost, `SameSite=Lax`), and the session id changes at login.
- CSRF protection is on for every state-changing request; `/api/**` answers `401`, never a redirect.
- Services validate the JWT: signature, `iss`, `aud` = `pixora-api`, `exp`. No endpoint trusts a user id sent by the client; the user is the token's subject.
- Keycloak realm (as code): brute-force protection on; a password policy that follows ASVS 5.0 (a minimum length, no composition rules, rejection of common or breached passwords); client `pixora-bff` exactly as in section 9 (authorization code + PKCE only, exact redirect URIs, no implicit or password grants).
- Logout ends the gateway session and the Keycloak session.

**Input and output**

- All input validated (type, length, format) at the API; queries are parameterized (JPA / Spring Data, never string-built SQL or JPQL).
- No user input reaches a file path, a shell command, a URL the server fetches (SSRF) or a log line unescaped.
- Error responses never contain stack traces, SQL, class names or internal hosts (RFC 9457 handler).
- Angular: no `innerHTML` with user content or `bypassSecurityTrust*`; captions and comments are rendered as text.

**Uploads** (`docs/media.md`)

- Presigned URLs: one object, short expiry, the exact content type and size limit.
- The server verifies the real file type from its bytes (not the extension or the declared type), enforces the size limit, re-encodes the image and strips metadata (EXIF, GPS) before it is served.
- Uploaded files are never served from the upload bucket and never executed.

**Secrets, data and logging**

- No secret in code, config files, images, test fixtures or logs. Secrets come from environment variables.
- Logs never contain tokens, passwords, cookies, full emails or request bodies with personal data.
- Personal data stored only where the plan needs it.

**Transport and headers**

- Gateway response headers: `Content-Security-Policy`, `Strict-Transport-Security` (when HTTPS), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `frame-ancestors 'none'`.
- CORS: none needed (same origin); any CORS config is a finding unless the plan explains it.
- Rate limits on login, sign-up, password reset and uploads (gateway, Redis).

**Dependencies**

- A new dependency is actively maintained, has no known vulnerability (dependency review, Trivy), and has a license compatible with Apache 2.0.

## Findings

Write them in the code-review-task format, each with a **severity**, and submit them as a GitHub review from the `pixora-review` App with `--role security` (`pixora-review submit --repo <repo> --pr <pr> --role security --verdict approve|request-changes --body-file review.md`). The merge gate requires your approval on the head commit for security paths, dependency changes and upload handling. Severities:

| Severity | Meaning                                                                          | Effect                                                 |
| -------- | -------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Critical | Exploitable now: data of other users, account takeover, remote code execution    | Blocking; mention the owner                            |
| High     | Exploitable with some conditions, or a missing core control (auth, access check) | Blocking                                               |
| Medium   | Defence in depth missing, limited impact                                         | Blocking unless the Tech Lead accepts it with an issue |
| Low      | Hardening, best practice                                                         | Suggestion; open an issue if worth it                  |

Give the attack in one or two sentences ("user A can delete user B's comment by sending ..."), the ASVS requirement or cheat sheet it breaks, and the fix.

## Threat models

For each new flow (sign-up/login, upload, feed, search...) keep `docs/security/<flow>.md` in the hub: the assets, the entry points, the threats (STRIDE), the controls in place and the open risks. Create or update it through a hub docs sub-issue when a plan adds or changes a flow; review it when you review that flow's PRs.
