# JSONbin.io

> Cloud-based JSON document store for saving and retrieving data via simple HTTP REST requests.

- **Official Website**: <a href="https://jsonbin.io/" target="_blank" rel="noopener noreferrer">jsonbin.io</a>
- **Category**: [Database & Backend-as-a-Service](../README.md#database--backend-as-a-service)
- **Type**: Cloud JSON Storage API

---

## Overview

JSONbin.io is an easy-to-use cloud document storage service that lets developers store, manage, and read JSON records using simple HTTP REST requests.

It is particularly useful for static websites and prototypes that need to persist small datasets—like site configurations, survey responses, bookmarks, or leaderboards—without setting up a complex database.

---

## Key Highlights & Features

- **Simple REST Endpoints**: Read and write JSON objects using standard `fetch()` calls.
- **Version History**: Keeps track of previous versions of your JSON records.
- **Public & Private Bins**: Protect bins with master keys or make them read-only for public access.
- **Schema Validation**: Validate stored JSON objects against strict JSON schemas.

---

## How It Works with Static Websites

Fetch data from JSONbin directly in vanilla JavaScript:

```javascript
async function getStoredData() {
  const res = await fetch("https://api.jsonbin.io/v3/b/YOUR_BIN_ID/latest", {
    headers: {
      "X-Access-Key": "YOUR_ACCESS_KEY"
    }
  });
  const data = await res.json();
  console.log("Retrieved data:", data.record);
}
```

---

## When to Use It

- Prototypes, demos, and lightweight static applications.
- Storing simple site counters, guestbooks, or user-submitted feedback.
- Projects where setting up a full SQL or NoSQL database is overkill.

---

[← Back to Database & Backend-as-a-Service](../README.md#database--backend-as-a-service) | [← Back to Static Website Toolkit](../README.md)
