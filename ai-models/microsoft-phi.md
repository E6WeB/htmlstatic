# Microsoft Phi (Phi-4)

> Small Language Models (SLMs) engineered for maximum efficiency, low memory footprint, and edge execution.

- **Official Website**: <a href="https://azure.microsoft.com/en-us/products/phi/" target="_blank" rel="noopener noreferrer">azure.microsoft.com/.../phi</a>
- **Category**: [AI Models](../README.md#ai-models)
- **Type**: Small Language Model (SLM)
- **Pricing / License**: Open Source

---

## Overview

Microsoft's Phi model series (including Phi-3 and Phi-4) demonstrates that compact models trained on high-quality synthetic data and curated textbooks can match or exceed models many times their size. Phi models are specifically designed to run efficiently on resource-constrained devices, edge servers, and client-side web browsers.

---

## Key Highlights & Features

**Compact Footprint**: 3B to 14B parameter sizes optimized for edge servers, mobile devices, and local developer machines.
**High Reasoning Quality**: Outperforms many larger models on coding, reasoning, and mathematics benchmarks.
**Browser-Ready**: Perfect candidate for running client-side AI inside static HTML pages via ONNX Runtime Web and WebGPU.
**Zero Cloud Dependency**: Execute offline privacy-preserving search, summarization, and autocomplete in the browser.

---

## How It Works with Static Websites

Static websites can integrate Microsoft Phi (Phi-4) directly via secure client-side fetch calls (with appropriate rate-limiting or serverless edge proxies like Cloudflare Workers), through build-time static generation scripts, or by deploying local open-weight models.

```javascript
// Phi models can be loaded directly in the browser via WebGPU using ONNX Runtime
// or called via lightweight local server endpoints:
const res = await fetch("http://localhost:8080/v1/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "phi-4",
    messages: [{ role: "user", content: "Format this unstyled markdown into valid HTML5." }]
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
