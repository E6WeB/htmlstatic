# Mistral AI (Mistral Large & Codestral)

> Leading European open and commercial models celebrated for speed, lightweight efficiency, and specialized code generation.

- **Official Website**: <a href="https://mistral.ai/" target="_blank" rel="noopener noreferrer">mistral.ai</a>
- **Category**: [AI Models](../README.md#ai-models)
- **Type**: Open-Weights & Frontier Model
- **Pricing / License**: Open Source

---

## Overview

Mistral AI is a Paris-based AI company that has created some of the most widely adopted open-weights models in the world. Their portfolio includes open Apache 2.0 models (Mistral 7B, Mixtral 8x7B, Mixtral 8x22B) and frontier commercial models (Mistral Large 2) as well as Codestral, a 22B model dedicated specifically to coding.

---

## Key Highlights & Features

**Codestral**: Specialized 22B parameter code generation model supporting 80+ programming languages with 32k context.
**Mixture-of-Experts (MoE)**: Pioneered accessible open MoE architectures for lightning-fast inference latency.
**Function Calling & JSON Mode**: Native support for schema-enforced JSON outputs and external tool execution.
**Open Weights & Hosted API**: Available both as open downloadable weights for local hosting and via a fast hosted API (La Plateforme).

---

## How It Works with Static Websites

Static websites can integrate Mistral AI (Mistral Large & Codestral) directly via secure client-side fetch calls (with appropriate rate-limiting or serverless edge proxies like Cloudflare Workers), through build-time static generation scripts, or by deploying local open-weight models.

```javascript
// Calling Codestral via Mistral API
const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${MISTRAL_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "codestral-latest",
    messages: [{ role: "user", content: "Write a zero-dependency vanilla JS image slider component." }]
  })
});
```

---

## When to Use It

- Adding intelligent search, summarization, or interactive chat widgets to static websites.
- Pre-rendering dynamic content, translating articles, and generating static markdown at build time.
- Powering local, privacy-first developer tools and offline client-side web applications.
