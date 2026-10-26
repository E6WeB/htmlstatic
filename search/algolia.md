# Algolia

> Hosted search API with typo-tolerant search and pre-built frontend widgets.

- **Official Website**: <a href="https://www.algolia.com/" target="_blank" rel="noopener noreferrer">algolia.com</a>
- **Category**: [Search](../README.md#search)
- **Type**: Hosted Search Engine API

---

## Overview

Algolia is an enterprise-grade hosted search API that delivers search results in milliseconds. It offers typo tolerance, faceted search, custom ranking, and pre-built frontend UI libraries (InstantSearch.js).

Static websites can index their content during their CI build and query Algolia directly from the client browser using read-only search API keys.

---

## Key Highlights & Features

- **As-You-Type Speed**: Instant search results returned in under 20 milliseconds.
- **Smart Typo Tolerance**: Finds accurate results even with spelling mistakes.
- **InstantSearch.js**: Pre-built, customizable search UI components.
- **DocSearch Program**: Free search service for qualifying open-source documentation.

---

## How It Works with Static Websites

Embed Algolia InstantSearch in a static HTML page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@8/themes/satellite-min.css">
<script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4"></script>

<div id="searchbox"></div>
<div id="hits"></div>

<script>
  const search = instantsearch({
    indexName: 'YOUR_INDEX_NAME',
    searchClient: algoliasearch('YOUR_APP_ID', 'YOUR_SEARCH_ONLY_API_KEY'),
  });

  search.addWidgets([
    instantsearch.widgets.searchBox({ container: '#searchbox' }),
    instantsearch.widgets.hits({ container: '#hits' })
  ]);

  search.start();
</script>
```

---

## When to Use It

- Large ecommerce catalogs and documentation portals requiring instant faceted search.
- Open-source projects qualifying for the free Algolia DocSearch program.
- Websites demanding advanced search ranking, analytics, and query personalization.
