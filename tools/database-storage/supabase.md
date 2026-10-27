# Supabase

> Open-source Firebase alternative with real-time Postgres, storage, and auto-generated APIs.

- **Official Website**: <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer">supabase.com</a>
- **Category**: [Database & Backend-as-a-Service](../../README.md#database--backend-as-a-service)
- **Type**: Backend-as-a-Service (BaaS)

---

## Overview

Supabase is an open-source Backend-as-a-Service that provides developers with a full PostgreSQL database, real-time change subscriptions, authentication, file storage, and auto-generated REST and GraphQL APIs.

Because queries can be executed directly from client-side JavaScript using public anonymous keys and protected with Postgres Row Level Security (RLS), static sites can build dynamic applications without running their own backend server.

---

## Key Highlights & Features

- **Full PostgreSQL Database**: Enterprise-grade SQL database with relations and views.
- **Auto-Generated REST APIs**: Instant endpoints for querying, inserting, and updating data.
- **Real-time Subscriptions**: Listen to database changes over WebSockets instantly.
- **File Storage**: Upload and serve images and user assets with CDN caching.

---

## How It Works with Static Websites

Query data directly from static HTML/JavaScript:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<ul id="items-list"></ul>

<script>
  const supabase = window.supabase.createClient(
    "https://YOUR_PROJECT.supabase.co",
    "YOUR_ANON_PUBLIC_KEY"
  );

  async function loadData() {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("title, created_at")
      .order("created_at", { ascending: false });

    if (posts) {
      document.getElementById("items-list").innerHTML = posts
        .map(p => `<li>${p.title}</li>`)
        .join("");
    }
  }

  loadData();
</script>
```

---

## When to Use It

- Static sites needing user-generated content (reviews, job boards, community listings).
- Applications needing real-time collaborative updates or chat feeds.
- Developers wanting the reliability of Postgres without maintaining database servers.
