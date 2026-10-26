# DeepSeek (DeepSeek-V3 / R1)

> High-efficiency open-weights foundation and reasoning model engineered with Mixture-of-Experts architecture.

- **Official Website**: <a href="https://deepseek.com/" target="_blank" rel="noopener noreferrer">deepseek.com</a>
- **Category**: [AI Models](../README.md#ai-models)
- **Type**: Open-Weights & Reasoning Foundation Model
- **Pricing / License**: Open Source

---

## Overview

DeepSeek has emerged as a groundbreaking open-weights model family. Utilizing an innovative Multi-Head Latent Attention (MLA) and Mixture-of-Experts (MoE) architecture, DeepSeek delivers frontier-grade coding, mathematics, and reasoning performance at an unprecedented low inference cost.

---

## Key Highlights & Features

**Open Weights**: Fully accessible model weights available on Hugging Face for self-hosting and private cloud inference.
**DeepSeek-R1 Reasoning**: Specialized chain-of-thought model capable of complex logical planning and code verification.
**Ultra-Low API Pricing**: Extremely economical API endpoints, making it accessible for static sites with high query volumes.
**OpenAI API Compatible**: Drop-in replacement for existing OpenAI SDKs and fetch wrappers by changing base URLs.

---

## How It Works with Static Websites

Static websites can integrate DeepSeek (DeepSeek-V3 / R1) directly via secure client-side fetch calls (with appropriate rate-limiting or serverless edge proxies like Cloudflare Workers), through build-time static generation scripts, or by deploying local open-weight models.

```javascript
// DeepSeek OpenAI-compatible endpoint
const res = await fetch("https://api.deepseek.com/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "deepseek-chat",
    messages: [{ role: "user", content: "Optimize this static website CSS for minimal payload size." }]
  })
});
```

---

## When to Use It

- Adding intelligent search, summarization, or interactive chat widgets to static websites.
- Pre-rendering dynamic content, translating articles, and generating static markdown at build time.
- Powering local, privacy-first developer tools and offline client-side web applications.
