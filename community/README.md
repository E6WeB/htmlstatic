# StaticStack Community Forum for Wasmer Edge

A community forum built with HTML, CSS, JavaScript (Node.js), Wasmer Edge's managed PostgreSQL database, and GitHub OAuth.

## Features

- **Pure HTML, CSS, and JavaScript:** No PHP required.
- **Unified Deployment:** Runs seamlessly directly under `https://www.staticstack.app/community/` on the main StaticStack app.
- **GitHub OAuth:** Fast, secure sign-in via GitHub accounts.
- **Discussion Engine:** Categories, topics, replies, search, and author cards.
- **Reputation & Voting:** Upvote/downvote discussions and replies with transactional score calculation.
- **Moderation:** Built-in reporting system and administrator moderation queue for the configured admin (`ADMIN_GITHUB_LOGIN`).
- **PostgreSQL Database:** Powered by Wasmer Edge's managed PostgreSQL database with SSL.

## Endpoints

- Forum Frontend: `GET /community/`
- Bootstrap & API: `GET|POST /community/api`
  - `action=bootstrap`: Loads user session and category list
  - `action=topics`: Retrieves discussions filtered by category or search query
  - `action=topic&id=<ID>`: Retrieves topic details and replies
  - `action=create_topic`: Publishes a new discussion (requires GitHub login)
  - `action=reply`: Posts a reply (requires GitHub login)
  - `action=vote`: Upvotes/downvotes topics and replies (requires GitHub login)
  - `action=report`: Submits a moderation report (requires GitHub login)
  - `action=admin_reports`: Lists pending reports (admin only)
  - `action=moderate`: Hides or restores topics/replies (admin only)
  - `action=review_report`: Marks report reviewed or dismissed (admin only)
- OAuth Flow: `GET /community/oauth`
  - `action=login`: Initiates GitHub OAuth authentication
  - `action=callback`: Exchanges code for access token and creates user session
  - `action=logout`: Clears session cookie

## GitHub OAuth App Setup

In GitHub (**Settings → Developer settings → OAuth Apps → New OAuth App**):
- **Application name:** StaticStack Community
- **Homepage URL:** `https://www.staticstack.app/community/`
- **Authorization callback URL:** `https://www.staticstack.app/community/oauth?action=callback`

## Environment Variables

| Variable | Description |
|---|---|
| `DB_HOST` | PostgreSQL Host (`psql.fr-roub1.bengt.wasmernet.com`) |
| `DB_PORT` | PostgreSQL Port (`20184`) |
| `DB_NAME` | PostgreSQL Database (`staticstack_forum`) |
| `DB_USERNAME` | PostgreSQL User (`user_37640154`) |
| `DB_PASSWORD` | PostgreSQL Password |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
| `SESSION_SECRET` | 32+ character random secret used for HMAC SHA-256 session signatures |
| `ADMIN_GITHUB_LOGIN` | GitHub login for the admin account (e.g. `E6WeB`) |
| `APP_BASE_URL` | Base application URL (`https://www.staticstack.app`) |

Wasmer automatically injects the database credentials when the managed PostgreSQL database is attached.
