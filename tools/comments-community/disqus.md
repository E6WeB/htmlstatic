# Disqus

> Hosted commenting system for websites with social logins and moderation tools.

1. **Official Website**: <a href="https://disqus.com/" target="_blank" rel="noopener noreferrer">disqus.com</a>
2. **Category**: [Comments & Community](../../README.md#comments--community)
3. **Type**: Hosted Discussion Network
4. **Pricing / License**: Freemium

- **Tags**: `disqus-comments`, `blog-comment-widget`, `social-comments`, `moderation-tools`, `embedded-discussions`, `static-blog-comments`, `disqus-alternative`, `github-comments`, `no-database`, `community-widget`
---

## Overview

Disqus is one of the most widely recognized hosted comment platforms on the web. It provides rich discussion threads, voting, social authentication (Google, Facebook, Twitter), email notifications, and moderation tools.

It can be added to any static HTML page by embedding a simple JavaScript snippet.

---

## Key Highlights & Features

1. **Social Logins**: Users can comment using Google, Facebook, Twitter, or Disqus accounts.
2. **Comprehensive Moderation**: Pre-moderation, spam filtering, and banned-word lists.
3. **Rich Media Support**: Allows users to include images, formatting, and hyperlinks.
4. **Notification System**: Visitors get email alerts when others reply to their comments.

---

## How It Works with Static Websites

Embed Disqus into your static article page:

```html
<div id="disqus_thread"></div>
<script>
  var disqus_config = function () {
    this.page.url = window.location.href;
    this.page.identifier = window.location.pathname;
  };
  (function() {
    var d = document, s = d.createElement('script');
    s.src = 'https://YOUR_SHORTNAME.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  })();
</script>
```

---

## When to Use It

1. High-traffic lifestyle, news, or general-interest blogs.
2. Websites where visitors prefer standard social network logins.
3. Publishers wanting automated comment moderation and user notifications.
