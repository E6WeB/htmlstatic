# How to Add Search Functionality to a Static Website

Search is one of the most critical features for any website with more than a dozen pages. On dynamic sites like WordPress or Drupal, search queries execute via SQL `LIKE` commands or dedicated Elasticsearch clusters.

On static websites, there is no database running on the server. So how can visitors search your static articles, documentation, or product catalogs?

The answer is **Client-Side Static Search**. By indexing your HTML files during the build process, the browser can execute complex, full-text searches in **under 30 milliseconds** directly on the client with zero server roundtrips.

In this sixth part of the **Static HTML Starter Series** (after wiring up contact forms in [Part 5](/blog/how-to-add-contact-forms-to-static-websites/)), you will learn how static search works, compare the leading static search engines, and follow a complete tutorial to integrate **[Pagefind](/tools/search/pagefind)** into your website.

---

<h2 id="how-it-works">How Client-Side Static Search Works</h2>

Traditional search engines send a request to a server for every keystroke. Static search inverts this workflow:

1. **Build-Time Indexing**: When you compile your static site (or run a build script), an indexing tool scans all your `.html` files, extracts the text content, strips navigation chrome, and compiles a microscopic, chunked search index.
2. **Chunked Delivery**: Instead of forcing visitors to download a massive 10MB search index upfront, modern tools like [Pagefind](/tools/search/pagefind) split the index into tiny 20KB shards.
3. **Instant Browser Execution**: As the user types `"contact form"`, the browser downloads only the specific index shards containing those words and renders results instantly.

---

<h2 id="top-search-tools">Top Static Search Solutions Compared</h2>

| Solution | Hosting Type | Setup Complexity | Free Limits | Ideal Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **[Pagefind](/tools/search/pagefind)** | 100% Self-Hosted Static | Zero Config (Run CLI) | **Completely Free / Open Source** | Documentation, blogs, knowledge bases |
| **[Algolia](/tools/search/algolia)** | Cloud Hosted API | Medium (API Keys) | 10,000 records free / mo | Large ecommerce catalogs, faceting |
| **Custom JSON Search** | Self-Hosted JSON | Low (Vanilla JS) | **Free** | Portfolios, directories (like [StaticStack Search](/search)) |

---

<h2 id="pagefind-tutorial">Step-by-Step Tutorial: Implementing Pagefind</h2>

**[Pagefind](/tools/search/pagefind)** is the modern standard for static search. Built in Rust by CloudCannon, it requires zero server configuration and works with any static site generator ([Astro](/tools/static-site-generators/astro), [11ty](/tools/static-site-generators/eleventy), [Hugo](/tools/static-site-generators/hugo), or plain HTML).

### Step 1: Add the Search UI Element to Your HTML
In the page where you want the search bar to appear (for example, `/search/index.html`), add a container element:

```html
<!-- Load Pagefind UI Assets -->
<link rel="stylesheet" href="/pagefind/pagefind-ui.css">
<script src="/pagefind/pagefind-ui.js"></script>

<!-- Search Container -->
<div id="search"></div>

<script>
  window.addEventListener('DOMContentLoaded', () => {
    new PagefindUI({
      element: "#search",
      showSubResults: true,
      resetStyles: false
    });
  });
</script>
```

### Step 2: Index Your Static Site Output
After generating your HTML pages, run the Pagefind CLI pointing to your build folder (e.g., `dist`, `_site`, or `public`):

```bash
npx -y pagefind --site dist
```

Pagefind will:
1. Crawl every HTML file in your output directory.
2. Generate a `/pagefind/` folder containing the client-side JavaScript, CSS, and chunked WebAssembly search indexes.
3. Finish indexing thousands of pages in just a few seconds.

### Step 3: Controlling What Gets Indexed
You don't want your navigation bar, footer, or legal notices polluting search results. Pagefind makes filtering effortless with standard HTML attributes:

* **Exclude sections**: Add `data-pagefind-ignore` to sidebars, headers, and footers.
* **Define primary content**: Add `data-pagefind-body` to your `<main>` or `<article>` element.
* **Filter by category**: Add `data-pagefind-filter="category:Hosting"` to enable faceted filtering.

```html
<header data-pagefind-ignore>
  <!-- Navigation links are not indexed -->
</header>

<main data-pagefind-body>
  <!-- Only this core content is indexed for search -->
  <h1>How to Deploy to Cloudflare Pages</h1>
  <p>Learn how to host static websites globally...</p>
</main>
```

---

<h2 id="custom-json-search">Alternative: Building a Lightweight Vanilla JS Search</h2>

For small to medium directories (under 500 items, like our [StaticStack Search](/search) page), you can build an instant search engine in under 50 lines of pure Vanilla JavaScript using a pre-compiled JSON file.

### 1. Build a `search-data.json` File
During build time, export your items as an array:

```json
[
  {
    "title": "Astro",
    "slug": "astro",
    "category": "Static Site Generators",
    "desc": "The web framework for content-driven websites."
  },
  {
    "title": "Cloudflare Pages",
    "slug": "cloudflare-pages",
    "category": "Hosting & Deployment",
    "desc": "Fast, secure, free global static edge hosting."
  }
]
```

### 2. Fetch and Filter on Input
```javascript
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
let searchData = [];

// Fetch index once
fetch('/asset/json/search-data.json')
  .then(res => res.json())
  .then(data => { searchData = data; });

// Filter on user keystroke
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  if (!query) {
    resultsContainer.innerHTML = '';
    return;
  }

  const matches = searchData.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.desc.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );

  resultsContainer.innerHTML = matches.map(m => `
    <div class="result-card">
      <a href="/tools/${m.slug}">
        <h4>${m.title}</h4>
        <p>${m.desc}</p>
      </a>
    </div>
  `).join('');
});
```

---

<h2 id="best-practices">Static Search Best Practices</h2>

1. **Highlight Match Terms**: Use `<mark>` tags to highlight matching search words in result snippets.
2. **Keyboard Accessibility**: Bind the `/` key to automatically focus the search bar from anywhere on your site.
3. **Debounce High-Frequency Input**: If querying larger datasets, use a 150ms debounce function to avoid redundant UI renders.

---

## Conclusion

You don't need a heavy database server to provide visitors with a modern search experience. With static indexing tools like **[Pagefind](/tools/search/pagefind)** or client-side JSON search, your search results appear instantaneously.

Explore our curated [Search Category](/category/search/) to discover more static search engines and indexing tools.

**Next in Part 7:** Finish your static site setup by adding zero-database reader discussions in [How to Add Comments to a Static HTML Blog](/blog/how-to-add-comments-to-a-static-html-blog/).

