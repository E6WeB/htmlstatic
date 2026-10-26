# Disqus

> Hosted commenting system for websites with social logins and moderation tools.

- **Official Website**: <a href="https://disqus.com/" target="_blank" rel="noopener noreferrer">disqus.com</a>
- **Category**: [Comments & Community](../README.md#comments--community)
- **Type**: Hosted Discussion Network

---

## Overview

Disqus is one of the most widely recognized hosted comment platforms on the web. It provides rich discussion threads, voting, social authentication (Google, Facebook, Twitter), email notifications, and moderation tools.

It can be added to any static HTML page by embedding a simple JavaScript snippet.

---

## Key Highlights & Features

- **Social Logins**: Users can comment using Google, Facebook, Twitter, or Disqus accounts.
- **Comprehensive Moderation**: Pre-moderation, spam filtering, and banned-word lists.
- **Rich Media Support**: Allows users to include images, formatting, and hyperlinks.
- **Notification System**: Visitors get email alerts when others reply to their comments.

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

- High-traffic lifestyle, news, or general-interest blogs.
- Websites where visitors prefer standard social network logins.
- Publishers wanting automated comment moderation and user notifications.

---

[← Back to Comments & Community](../README.md#comments--community) | [← Back to Static Website Toolkit](../README.md)
