# ProcessWire

> Free, flexible open-source CMS and content management framework designed for clean markup and developer freedom.

1. **Official Website**: <a href="https://processwire.com/" target="_blank" rel="noopener noreferrer">processwire.com</a>
2. **Category**: [Content Management](../../README.md#content-management)
3. **Type**: Open Source CMS & CMF
4. **Pricing / License**: Open Source

- **Tags**: `processwire`, `open-source-cms`, `headless-cms`, `php-content-framework`, `custom-fields-cms`, `clean-markup`, `content-management`, `wordpress-alternative`, `flexible-api`, `rest-api-cms`
---

## Overview

ProcessWire is a free, open-source Content Management System and Content Management Framework (CMS/CMF) engineered to give developers complete control over their markup, fields, and URL structure.

Unlike traditional CMS platforms that enforce rigid theme frameworks or inject unwanted HTML into your templates, ProcessWire produces zero frontend markup of its own. It treats all content as a hierarchical tree of pages, where each page template can be customized with exact field types (text, rich text, repeaters, file uploads, page relationships, and page tables).

For static site workflows and modern decoupled architectures, ProcessWire excels both as a high-performance content hub and as a headless CMS. Its intuitive jQuery-inspired PHP API makes it effortless to query structured data, export static HTML, or serve JSON endpoints to Jamstack static generators like Astro, Eleventy, or Hugo.

---

## Key Highlights & Features

1. **Complete Markup Freedom**: No pre-baked theme CSS or HTML bloat; you control every single character delivered to the browser.
2. **jQuery-Inspired Selectors API**: Query and filter pages using clean, intuitive syntax (`$pages->find("parent=/blog/, sort=-date, limit=10")`).
3. **Custom Fields Everywhere**: Every template can hold custom fields (repeaters, images, dates, matrix fields) with automatic sanitization.
4. **Headless & Decoupled Ready**: Expose custom JSON endpoints, use GraphQL modules, or export static builds seamlessly.
5. **Rock-Solid Security**: Built with parameterized queries, rigorous input sanitization, and enterprise-grade role-based access control (RBAC).
6. **Multi-Language Support**: Native multi-language URL and field translation capabilities built into core.

---

## How It Works with Static Websites & Jamstack

### 1. Intuitive Data Querying:

In your template file or export script, querying structured content is as clean as jQuery:

```php
// Fetch latest 5 published articles
$articles = $pages->find("template=article, sort=-publish_date, limit=5");

foreach ($articles as $item) {
  echo "<article>";
  echo "<h2>" . $sanitizer->entities($item->title) . "</h2>";
  echo "<p>" . $sanitizer->entities($item->summary) . "</p>";
  echo "<a href='{$item->url}'>Read more</a>";
  echo "</article>";
}
```

### 2. Headless JSON API Output:

To serve structured data to an Astro or Next.js static site build, you can return clean JSON in seconds:

```php
// /site/templates/api-posts.php
header('Content-Type: application/json; charset=utf-8');

$posts = $pages->find("template=post, sort=-created, limit=20");
$data = [];

foreach ($posts as $p) {
  $data[] = [
    'id' => $p->id,
    'title' => $p->title,
    'slug' => $p->name,
    'summary' => $p->summary,
    'content' => $p->body,
    'date' => date('c', $p->created),
    'image' => $p->featured_image ? $p->featured_image->httpUrl : null
  ];
}

echo json_encode($data);
```

---

## When to Use It

1. Projects where total control over clean HTML output is required without CMS theme bloat.
2. Headless CMS backends powering static site generators (Astro, 11ty, Next.js, Hugo).
3. Complex relational content structures (product directories, real estate listings, knowledge bases) needing custom fields.
4. Developers who appreciate lightweight, readable code and want an alternative to heavy WordPress installations.
