# Firebase Firestore

> Real-time cloud NoSQL database that static frontend applications can query directly.

1. **Official Website**: <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer">firebase.google.com</a>
2. **Category**: [Database & Backend-as-a-Service](../../README.md#database--backend-as-a-service)
3. **Type**: Serverless Cloud NoSQL Database
4. **Pricing / License**: Freemium

- **Tags**: `firestore`, `nosql-cloud-db`, `realtime-listeners`, `client-side-database`, `serverless-storage`, `google-firebase`, `serverless-database`, `baas`, `rest-api`, `realtime-db`
---

## Overview

Google Cloud Firestore is a scalable, cloud-hosted NoSQL database designed for mobile and web development. Static websites can query Firestore directly using Firebase client SDKs loaded via CDN.

Firestore features real-time listeners that update UI elements immediately whenever data changes on the server, paired with robust security rules for client-side authorization.

---

## Key Highlights & Features

1. **Real-Time Data Sync**: Automatically updates web pages when data changes on the server.
2. **Offline Caching**: Built-in client-side data caching for fast offline experiences.
3. **Generous Free Tier**: Generous daily read/write allowances for small to medium sites.
4. **Granular Security Rules**: Secure direct database access without an intermediary API server.

---

## How It Works with Static Websites

Include Firebase in your static HTML:

```html
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

  const app = initializeApp({
    apiKey: "YOUR_API_KEY",
    projectId: "YOUR_PROJECT_ID"
  });
  const db = getFirestore(app);

  const querySnapshot = await getDocs(collection(db, "announcements"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
</script>
```

---

## When to Use It

1. Static apps needing real-time updates like live voting, polls, or status dashboards.
2. Projects requiring reliable global database infrastructure backed by Google Cloud.
