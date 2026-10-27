# Cohere Command R+

> Enterprise-grade foundation model optimized for Retrieval-Augmented Generation (RAG) and document search.

- **Official Website**: <a href="https://cohere.com/" target="_blank" rel="noopener noreferrer">cohere.com</a>
- **Category**: [AI Models](../../README.md#ai-models)
- **Type**: Enterprise RAG Foundation Model
- **Pricing / License**: Freemium

---

## Overview

Cohere Command R+ is a foundation model tailored specifically for enterprise search, grounded retrieval, and multi-step tool use. It is engineered to power search interfaces, documentation bots, and question-answering systems with verified factual citations.

---

## Key Highlights & Features

**Built for RAG**: Natively trained to synthesize answers from indexed website documentation and return citation anchors.
**Multilingual Fluency**: High-accuracy performance across 10+ core enterprise languages.
**Tool & Connector Integration**: Calls external APIs and databases to retrieve fresh static data.
**Cost-Effective Scalability**: Optimized for high-throughput enterprise search queries.

---

## How It Works with Static Websites

Static websites can integrate Cohere Command R+ directly via secure client-side fetch calls (with appropriate rate-limiting or serverless edge proxies like Cloudflare Workers), through build-time static generation scripts, or by deploying local open-weight models.

```javascript
// Cohere Chat API with search grounding
const res = await fetch("https://api.cohere.com/v2/chat", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${COHERE_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "command-r-plus-08-2024",
    messages: [{ role: "user", content: "Search our static documentation and explain how to configure form endpoints." }]
  })
});
```

---

## When to Use It

- Adding intelligent search, summarization, or interactive chat widgets to static websites.
- Pre-rendering dynamic content, translating articles, and generating static markdown at build time.
- Powering local, privacy-first developer tools and offline client-side web applications.
