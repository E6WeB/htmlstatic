# Supabase Auth

> Open-source authentication supporting passwordless logins, OAuth providers, and JWTs.

- **Official Website**: <a href="https://supabase.com/auth" target="_blank" rel="noopener noreferrer">supabase.com/auth</a>
- **Category**: [Authentication & User Management](../README.md#authentication--user-management)
- **Type**: Open Source Authentication Service

---

## Overview

Supabase Auth provides secure, developer-friendly authentication built on top of Postgres. It allows static website frontends to sign up users, manage sessions, and verify identities directly via client-side JavaScript.

With native support for email/password, magic links, phone logins, and more than 20 OAuth providers (Google, GitHub, Discord, Apple), it gives static sites enterprise-grade auth without server infrastructure.

---

## Key Highlights & Features

- **Client-Side SDK**: Direct authentication calls from static frontend scripts.
- **20+ OAuth Providers**: Connect Google, GitHub, Twitter, Discord, and Apple logins in a few clicks.
- **Passwordless Magic Links**: Let users log in securely with an emailed OTP or link.
- **Row Level Security (RLS)**: Protect database data automatically according to the logged-in user.

---

## How It Works with Static Websites

Integrate Supabase Auth with vanilla JavaScript:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<button id="login-github">Log In with GitHub</button>
<button id="logout" style="display:none;">Log Out</button>

<script>
  const supabase = window.supabase.createClient(
    "https://YOUR_PROJECT.supabase.co",
    "YOUR_ANON_KEY"
  );

  document.getElementById("login-github").addEventListener("click", async () => {
    await supabase.auth.signInWithOAuth({ provider: "github" });
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      document.getElementById("login-github").style.display = "none";
      document.getElementById("logout").style.display = "block";
    }
  });
</script>
```

---

## When to Use It

- Static applications needing social login and user session persistence.
- Projects using Supabase as their backend database for row-level security.
- Open-source projects prioritizing privacy and data sovereignty.
