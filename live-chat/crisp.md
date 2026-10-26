# Crisp

> All-in-one multichannel customer messaging and live chat platform with a lightweight widget.

- **Official Website**: <a href="https://crisp.chat/" target="_blank" rel="noopener noreferrer">crisp.chat</a>
- **Category**: [Live Chat & Support](../README.md#live-chat--support)
- **Type**: Customer Messaging & Live Chat Platform

---

## Overview

Crisp is a modern customer support platform that provides an embeddable chat widget for websites. It enables static site owners to converse with visitors in real time, capture leads, and answer questions without managing complex customer relationship software.

The Crisp chat widget is lightweight and features customizable themes, language localization, and mobile apps for answering chats on iOS and Android.

---

## Key Highlights & Features

- **Generous Free Plan**: Includes live chat for up to 2 operators with mobile apps.
- **Lightweight Embed**: Asynchronous script designed not to hinder page load times.
- **Lead Capture**: Collects visitor emails automatically during conversation.
- **Audio & Video Messages**: Optional voice notes and screen sharing capabilities.

---

## How It Works with Static Websites

Embed the Crisp chat widget into the `<head>` of your static HTML:

```html
<script type="text/javascript">
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = "YOUR_WEBSITE_ID";
  (function () {
    d = document;
    s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
</script>
```

---

## When to Use It

- Static e-commerce stores and product landing pages requiring real-time presale support.
- SaaS landing pages and portfolios wanting direct communication with potential clients.
