# Grok (xAI)

> xAI's frontier reasoning and conversational model with real-time access to global live information.

- **Official Website**: <a href="https://x.ai/" target="_blank" rel="noopener noreferrer">x.ai</a>
- **Category**: [AI Models](../README.md#ai-models)
- **Type**: Frontier Real-Time Model
- **Pricing / License**: Paid

---

## Overview

Grok, built by xAI, is a frontier AI model designed for high-performance reasoning, coding, and real-time knowledge synthesis. Backed by the Colossus supercomputing cluster, Grok combines deep mathematical and coding capabilities with live data integration, making it powerful for analyzing real-time web trends and generating up-to-the-minute content.

---

## Key Highlights & Features

**Live Real-Time Awareness**: Integrates real-time information and live discourse directly into responses.
**Strong Coding Benchmarks**: Generates production-ready JavaScript, TypeScript, and modern responsive CSS.
**Grok Vision**: Multimodal capabilities for analyzing webpage designs, screenshots, and diagrams.
**REST API Access**: Developer endpoints compatible with standard chat completion formats.

---

## How It Works with Static Websites

Static websites can integrate Grok (xAI) directly via secure client-side fetch calls (with appropriate rate-limiting or serverless edge proxies like Cloudflare Workers), through build-time static generation scripts, or by deploying local open-weight models.

```javascript
// Calling Grok via the xAI API
const res = await fetch("https://api.x.ai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${XAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "grok-2-latest",
    messages: [{ role: "user", content: "What are the latest static web development trends this month?" }]
  })
});
```

---

## When to Use It

- Adding intelligent search, summarization, or interactive chat widgets to static websites.
- Pre-rendering dynamic content, translating articles, and generating static markdown at build time.
- Powering local, privacy-first developer tools and offline client-side web applications.
