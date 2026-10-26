# Meta Llama (Llama 3.3)

> The world's leading open-weights model family, enabling private local hosting and customizable web deployments.

- **Official Website**: <a href="https://llama.meta.com/" target="_blank" rel="noopener noreferrer">llama.meta.com</a>
- **Category**: [AI Models](../README.md#ai-models)
- **Type**: Open-Weights Foundation Model
- **Pricing / License**: Open Source

---

## Overview

Meta Llama (including Llama 3.3 70B, Llama 3.1 405B, and lightweight 8B/1B variants) is the bedrock of open-source artificial intelligence. With permissive community licenses, Llama models can be run entirely locally on a laptop via Ollama, deployed on edge servers via Cloudflare Workers AI, or embedded directly in browser web pages via WebGPU.

---

## Key Highlights & Features

**Complete Independence**: Self-host models locally or on private infrastructure with zero vendor lock-in or recurring API costs.
**128k Context Window**: Supports processing long markdown articles, documentation files, and technical manuals.
**Edge Deployment**: Runs on Cloudflare Workers AI or Wasmer edge servers for instant global static site integrations.
**Browser Execution via WebGPU**: Smaller Llama variants (e.g. Llama 3.2 1B/3B) can execute completely client-side in the browser via WebLLM.

---

## How It Works with Static Websites

Static websites can integrate Meta Llama (Llama 3.3) directly via secure client-side fetch calls (with appropriate rate-limiting or serverless edge proxies like Cloudflare Workers), through build-time static generation scripts, or by deploying local open-weight models.

```javascript
// Running Llama locally via Ollama from a static site script
const res = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "llama3.3",
    prompt: "Write a high-converting hero headline for a static agency website."
  })
});
```

---

## When to Use It

- Adding intelligent search, summarization, or interactive chat widgets to static websites.
- Pre-rendering dynamic content, translating articles, and generating static markdown at build time.
- Powering local, privacy-first developer tools and offline client-side web applications.
