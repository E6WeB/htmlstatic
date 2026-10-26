# Claude (Anthropic)

> Anthropic's state-of-the-art model family renowned for coding excellence, nuance, and 200k+ context windows.

- **Official Website**: <a href="https://anthropic.com/" target="_blank" rel="noopener noreferrer">anthropic.com</a>
- **Category**: [AI Models](../README.md#ai-models)
- **Type**: Frontier AI & Reasoning Model
- **Pricing / License**: Freemium

---

## Overview

Anthropic's Claude model family (including Claude 3.5 Sonnet and Haiku) is celebrated for exceptional coding benchmarks, technical reasoning, and reduced hallucination rates. Its large context window enables feeding entire static codebases or documentation sets in a single prompt.

---

## Key Highlights & Features

**Industry-Leading Code Generation**: Excels at creating clean HTML5, modern CSS, and performant vanilla JavaScript.
**200,000+ Token Context**: Ingests hundreds of static markdown pages or API specifications at once.
**Prompt Caching**: Caches long static documentation prompts to slash API costs and reduce response times by up to 90%.
**Vision Capabilities**: Inspects webpage screenshots and mockups to convert visual designs into accessible HTML code.

---

## How It Works with Static Websites

Static websites can integrate Claude (Anthropic) directly via secure client-side fetch calls (with appropriate rate-limiting or serverless edge proxies like Cloudflare Workers), through build-time static generation scripts, or by deploying local open-weight models.

```javascript
// Calling Claude via the Messages API
const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
  },
  body: JSON.stringify({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Generate an accessible, semantic HTML5 pricing table component." }]
  })
});
```

---

## When to Use It

- Adding intelligent search, summarization, or interactive chat widgets to static websites.
- Pre-rendering dynamic content, translating articles, and generating static markdown at build time.
- Powering local, privacy-first developer tools and offline client-side web applications.

---

[← Back to AI Models](../README.md#ai-models) | [← Back to Static Website Toolkit](../README.md)
