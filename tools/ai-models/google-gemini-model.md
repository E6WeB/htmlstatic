# Google Gemini

> Google's multimodal frontier model family featuring native multimodal reasoning and up to 2M token context.

1. **Official Website**: <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">ai.google.dev</a>
2. **Category**: [AI Models](../../README.md#ai-models)
3. **Type**: Multimodal Frontier Model
4. **Pricing / License**: Freemium

- **Tags**: `gemini-api`, `2m-context-window`, `multimodal-llm`, `gemini-flash`, `vertex-ai`, `long-context-rag`, `audio-video-ai`, `llm-api`, `ai-agents`, `rag`
---

## Overview

Google Gemini (including Gemini 1.5 Pro, 1.5 Flash, and Gemini 2.0) is built from the ground up to be multimodal across text, code, audio, image, and video. It provides the largest context window in the industry (up to 2,000,000 tokens), allowing developers to process whole video tutorials, massive code repositories, and entire static documentation sets in a single pass.

---

## Key Highlights & Features

1. **Industry-Leading 2M Context**: Upload entire static websites, libraries, and datasets without chunking or vector databases.
2. **Native Multimodality**: Process images, wireframe sketches, video recordings, and audio files alongside text.
3. **Gemini 1.5 Flash**: Sub-second response times ideal for client-side search and interactive static site widgets.
4. **Generous Free Tier**: Google AI Studio provides free API quota for rapid prototyping and personal static sites.

---

## How It Works with Static Websites

Static websites can integrate Google Gemini directly via secure client-side fetch calls (with appropriate rate-limiting or serverless edge proxies like Cloudflare Workers), through build-time static generation scripts, or by deploying local open-weight models.

```javascript
// Calling Gemini via Google AI Studio API
const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Extract key FAQ items from this static HTML page into JSON format." }] }]
  })
});
```

---

## When to Use It

1. Adding intelligent search, summarization, or interactive chat widgets to static websites.
2. Pre-rendering dynamic content, translating articles, and generating static markdown at build time.
3. Powering local, privacy-first developer tools and offline client-side web applications.
