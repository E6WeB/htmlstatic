# Cohere Command R+

> Enterprise-grade foundation model optimized for Retrieval-Augmented Generation (RAG) and document search.

1. **Official Website**: <a href="https://cohere.com/" target="_blank" rel="noopener noreferrer">cohere.com</a>
2. **Category**: [AI Models](../../README.md#ai-models)
3. **Type**: Enterprise RAG Foundation Model
4. **Pricing / License**: Freemium

- **Tags**: `cohere-api`, `command-r`, `enterprise-rag`, `semantic-search`, `rerank-api`, `vector-embeddings`, `cited-llm`, `llm-api`, `ai-agents`, `rag`
---

## Overview

Cohere Command R+ is a foundation model tailored specifically for enterprise search, grounded retrieval, and multi-step tool use. It is engineered to power search interfaces, documentation bots, and question-answering systems with verified factual citations.

---

## Key Highlights & Features

1. **Built for RAG**: Natively trained to synthesize answers from indexed website documentation and return citation anchors.
2. **Multilingual Fluency**: High-accuracy performance across 10+ core enterprise languages.
3. **Tool & Connector Integration**: Calls external APIs and databases to retrieve fresh static data.
4. **Cost-Effective Scalability**: Optimized for high-throughput enterprise search queries.

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

1. Adding intelligent search, summarization, or interactive chat widgets to static websites.
2. Pre-rendering dynamic content, translating articles, and generating static markdown at build time.
3. Powering local, privacy-first developer tools and offline client-side web applications.
