# How to Add Comments to a Static HTML Blog

One of the defining benefits of running a static blog is the total absence of database bloat. But when developers decide to add reader comments, they frequently hit a dilemma:

> *"If my blog is just static HTML files, where do comments get stored? Do I have to install WordPress or set up a MySQL database just to let people talk?"*

Fortunately, you do not. Modern static websites use **serverless comment systems** that delegate discussion threads to secure, high-availability backends—most notably **GitHub Discussions**.

In this guide, you will learn why traditional comment plugins like Disqus are obsolete, explore the best open-source alternatives, and follow a step-by-step tutorial to install **[Giscus](/tools/comments-community/giscus)** on any static HTML blog.

---

<h2 id="why-avoid-disqus">Why Traditional Comment Plugins Fail</h2>

For years, Disqus was the default solution for static websites. However, over time, traditional hosted comment plugins have become notorious for:
* **Heavyweight Bloat**: Downloading up to 2MB of third-party JavaScript on every single page load.
* **Intrusive Tracking**: Injecting dozens of advertising trackers and cookies that trigger GDPR compliance headaches.
* **Aggressive Ads**: Inserting sponsored content and native advertisements directly into your layout.

By contrast, modern open-source comment engines like [Giscus](/tools/comments-community/giscus) and [Utterances](/tools/comments-community/utterances) are **100% ad-free, cookieless, lightweight, and completely open source**.

---

<h2 id="the-best-options">The Top Static Comment Systems Compared</h2>

| Solution | Backend Storage | Authentication | Tracking &amp; Ads | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **[Giscus](/tools/comments-community/giscus)** | GitHub Discussions API | GitHub OAuth | **Zero Ads, Zero Tracking** | Developer blogs, tech publications, tutorials |
| **[Utterances](/tools/comments-community/utterances)** | GitHub Issues API | GitHub OAuth | **Zero Ads, Zero Tracking** | Minimalist developer portfolios |
| **[Flarum](/tools/comments-community/flarum)** | Self-hosted PHP/MySQL | Multi-provider OAuth | Self-managed | Full standalone community forums |
| **[Disqus](/tools/comments-community/disqus)** | Proprietary Cloud | Social / Email | Ad-supported / Tracking | General consumer lifestyle blogs |

---

<h2 id="step-by-step-giscus">Step-by-Step Tutorial: Adding Giscus to Your Static Blog</h2>

**[Giscus](/tools/comments-community/giscus)** is our top recommendation for static websites. It leverages the official GitHub Discussions API:
* Every blog post automatically maps to its own discussion thread.
* Readers can reply, format in Markdown, and add emoji reactions (&plusmn;, &hearts;, &rocket;).
* When a reader comments, you receive a native GitHub notification.

### Step 1: Prepare Your Public GitHub Repository
1. Ensure your website repository (or a dedicated comments repository) is **Public**.
2. Go to your repository settings on GitHub: **Settings &rarr; Features**.
3. Check the box for **Discussions** to enable GitHub Discussions.

### Step 2: Install the Giscus GitHub App
1. Visit the [Giscus GitHub App](https://github.com/apps/giscus) page.
2. Click **Install** and grant access to your public discussions repository.

### Step 3: Configure Your Giscus Snippet
Visit [giscus.app](https://giscus.app/) and enter your repository details:
* **Repository**: `YourUsername/your-repo-name`
* **Page &harr; Discussion Mapping**: Choose `pathname` (this automatically associates `/blog/my-post/` with a discussion entitled `/blog/my-post/`).
* **Discussion Category**: Select `General` or `Announcements`.
* **Theme**: Choose `light`, `dark`, or `preferred_color_scheme`.

Giscus will generate a clean `<script>` embed:

```html
<section class="comments-container">
  <h3>Discussion &amp; Feedback</h3>
  <div class="giscus"></div>
</section>

<script src="https://giscus.app/client.js"
        data-repo="YourUsername/your-repo-name"
        data-repo-id="R_kgDOXXXXXX"
        data-category="General"
        data-category-id="DIC_kwDOXXXXXX"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="light"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>
```

### Step 4: Drop the Code into Your HTML Template
Paste the snippet directly into your blog article layout (for example, right below the article content, just as we do on [StaticStack](/tools/comments-community/giscus)).

Because Giscus uses the `async` attribute, it loads completely asynchronously without blocking the initial rendering of your blog text!

---

<h2 id="styling-tips">Styling &amp; Theme Integration Tips</h2>

To ensure the comment area matches your website's typography and spacing, wrap the widget in a styled container:

```css
.comments-container {
  margin-top: 3rem;
  padding: 2rem;
  background: var(--bg-surface, #ffffff);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.comments-container h3 {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: var(--text-main, #0f172a);
}
```

If your website supports dark mode, you can dynamically update the Giscus theme by sending a `postMessage` to the Giscus iframe whenever your user toggles themes:

```javascript
function setGiscusTheme(theme) {
  const iframe = document.querySelector('iframe.giscus-frame');
  if (!iframe) return;
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: theme } } },
    'https://giscus.app'
  );
}
```

---

<h2 id="faq">Frequently Asked Questions</h2>

### Do readers need a GitHub account to comment with Giscus?
Yes. Readers sign in with their GitHub account. For developer, design, and technical blogs, this is a major asset because it virtually eliminates spam bot comments without requiring CAPTCHA puzzles.

### What if my audience does not use GitHub?
If you run a mainstream consumer blog where visitors don't have GitHub accounts, consider:
* Embedding an open community forum like **[Flarum](/tools/comments-community/flarum)**.
* Directing users to a Facebook Community group (as seen on our [Contact page](/contact)).
* Using a lightweight hosted form like **[Web3Forms](/tools/contact-forms/web3forms)** for reader feedback.

---

## Conclusion

You don't have to surrender your static website's speed, privacy, or security just to let readers leave comments. By integrating **[Giscus](/tools/comments-community/giscus)**, your static blog gains high-speed, markdown-capable discussions with zero server upkeep.

Browse our [Comments &amp; Community Directory](/category/comments-community/) for more tools to engage your static website audience.

