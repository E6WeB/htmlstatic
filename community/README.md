# StaticStack Forum for Wasmer Edge

A starter forum for a static HTML/CSS/JavaScript community site. It uses Wasmer Edge's managed PostgreSQL database, GitHub OAuth, and a small PHP API. The frontend is plain HTML, CSS, and JavaScript; no framework or paid third-party forum service is required.

## Features

- GitHub-only sign-in (no passwords or alternative login providers)
- Categories, topic creation, replies, search, and user profile display
- Upvotes and downvotes for topics and replies (one vote per person per item; clicking the same vote removes it)
- Report content, admin report queue, hide/unhide topics and replies
- Neutral, responsive design intended to be easy to read
- PostgreSQL schema and automatic creation of tables/categories on the first API request

## Important before launch

This is a deployable starter package, not a live forum: you must configure the Wasmer app, GitHub OAuth app, and environment variables below. Test it on a private/staging URL before inviting people. The PHP runtime needs PDO PostgreSQL support, which is required to connect to Wasmer's managed PostgreSQL database.

## 1. Create the Wasmer app

1. Upload/import this project to a GitHub repository, or deploy it using your preferred Wasmer workflow.
2. Edit `app.yaml`: replace `YOUR_WASMER_USERNAME` with your Wasmer account/namespace. Choose a unique app `name` if `staticstack-forum` is already taken.
3. This config requests PostgreSQL in `ca-beau1` (Beauharnois, Canada), a region documented as supporting PostgreSQL. Wasmer currently documents PostgreSQL in `fr-roub1` and `ca-beau1`; Los Angeles supports MySQL but not PostgreSQL. If your app is already pinned to another region, resolve that before creating the database.
4. Deploy the app. Wasmer should provision one managed PostgreSQL database for this app and expose `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD` at runtime.
5. Set the environment variables listed below in the Wasmer app's environment/secrets settings. Never put secrets in `public/assets/app.js` or commit them to GitHub.

## 2. Create a GitHub OAuth app

In GitHub, open **Settings → Developer settings → OAuth Apps → New OAuth App**.

- **Application name:** StaticStack Community
- **Homepage URL:** the public URL of this forum app (or your forum's custom domain)
- **Authorization callback URL:** `https://YOUR-FORUM-DOMAIN/oauth.php?action=callback`

Create the app and copy its Client ID and Client Secret into the Wasmer environment variables. Use the exact same callback URL in GitHub and `APP_BASE_URL` (without a trailing slash for `APP_BASE_URL`). Do not publish the Client Secret.

## 3. Configure Wasmer environment variables

Set these in Wasmer's app settings:

| Variable | Value |
|---|---|
| `APP_BASE_URL` | Full public origin for this forum, e.g. `https://staticstack-forum.YOUR-ACCOUNT.wasmer.app` or your custom domain; no trailing slash |
| `FRONTEND_ORIGIN` | Optional. Exact origin of the site that embeds/uses the forum, e.g. `https://www.example.com`; no path or trailing slash. If the frontend is served from the same origin, it can be omitted. |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
| `SESSION_SECRET` | A random secret of at least 32 characters; use a password manager or cryptographic generator |
| `ADMIN_GITHUB_LOGIN` | Your exact GitHub username; this account gets administrator permissions |
| `SESSION_COOKIE` | Optional; defaults to `staticstack_forum_session` |

Wasmer injects `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD` when the managed database is attached. Do not manually hardcode those credentials in the repository.

## 4. Deploy and test

1. Open the public app URL and verify that the forum loads.
2. Click **Sign in with GitHub**. Approve the OAuth app and verify that you return to the forum signed in.
3. Create a test topic, reply, vote, and report it.
4. Sign in with the configured `ADMIN_GITHUB_LOGIN` account and verify the moderation panel appears. Test hide/unhide and report review.
5. Test from a phone and a desktop browser before sharing the forum publicly.

The app creates the required tables and starter categories on the first `/api.php?action=bootstrap` request. If you prefer manual setup, run `sql/schema.sql` against the attached PostgreSQL database. The schema file is also provided as a reference for backup/migration planning.

## 5. Embed it in your static website

The simplest embed is an iframe on a page in your existing static site:

```html
<iframe
  src="https://YOUR-FORUM-DOMAIN/"
  title="StaticStack Community Forum"
  loading="lazy"
  style="display:block;width:100%;min-height:900px;border:0;"
></iframe>
```

**Cookie note:** GitHub sign-in uses a secure, HttpOnly cookie. Browsers may block cookies when a forum on a completely unrelated domain is embedded in an iframe. For the most reliable embedded login, use a custom forum hostname under the same registrable domain as your static website (for example, `forum.example.com` alongside `www.example.com`). If you use a separate origin, set `FRONTEND_ORIGIN` to the exact embedding site origin. If sign-in is blocked by browser third-party-cookie restrictions, open the forum as a normal page on its own domain or configure the same-site custom domain.

## 6. Security and limitations

- GitHub is the only identity provider. No local password accounts are implemented.
- The GitHub Client Secret and session signing secret must remain server-side.
- Use HTTPS. The Wasmer app config forces HTTPS by default; cookies are marked Secure and HttpOnly.
- API write requests validate the `Origin` when a browser sends one. Do not set `FRONTEND_ORIGIN` to a wildcard or an untrusted site.
- Admin status is assigned by matching the configured `ADMIN_GITHUB_LOGIN` during GitHub sign-in. Keep that setting private and secure. Only one configured username is supported by this starter.
- The app has basic text moderation, not image/file uploads, email notifications, rate limiting, or a rich-text editor. Add abuse controls and review platform limits before a public launch.
- User-submitted content is rendered as escaped text; it does not accept raw HTML.
- Test database backup and credential rotation options in Wasmer before production use.

## Project layout

- `app.yaml` — Wasmer Edge app + PostgreSQL configuration
- `public/index.html` — forum page
- `public/assets/style.css` — responsive neutral design
- `public/assets/app.js` — browser UI
- `api.php` — JSON API and database-backed forum operations
- `oauth.php` — GitHub OAuth flow
- `lib.php` — shared database, cookie/session, and request helpers
- `sql/schema.sql` — PostgreSQL schema
- `config-check.php` — reports which required environment variable names are missing (never prints their values)

## Troubleshooting

- **Database not ready:** ensure the managed PostgreSQL database is attached and the five `DB_*` environment variables are present. Confirm PDO PostgreSQL support is available in the Wasmer PHP runtime.
- **GitHub callback error:** verify `APP_BASE_URL` and the callback URL in GitHub match exactly, including `https://` and `/oauth.php?action=callback`.
- **Sign-in returns but user appears logged out:** ensure the forum is HTTPS, the hostname is consistent, and browser cookie/third-party-cookie restrictions are not blocking the session cookie.
- **Admin panel missing:** sign out, confirm `ADMIN_GITHUB_LOGIN` matches your GitHub username exactly, then sign in again.
- **CORS errors when embedding:** set `FRONTEND_ORIGIN` to the exact website origin (scheme + host, no path), and ensure the custom-domain/cookie setup allows same-site credentials.
