# Google Fonts

> Extensive library of open-source web fonts and icons delivered via global CDN.

1. **Official Website**: <a href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer">fonts.google.com</a>
2. **Category**: [Typography & Web Fonts](../../README.md#typography--web-fonts)
3. **Type**: Web Font & Icon CDN
4. **Pricing / License**: Free / Open Source

- **Tags**: `google-fonts`, `free-open-source-typefaces`, `variable-web-fonts`, `material-symbols-icons`, `global-font-cdn`, `self-hosted-fonts`, `gdpr-fonts`, `google-fonts-alternative`, `variable-fonts`, `web-typography`
---

## Overview

Google Fonts is a free, open-source library of over 1,500 font families, variable fonts, and iconography collections (Material Symbols & Icons). It enables developers to integrate typography and vector icons into static websites with minimal setup, requiring only a `<link>` tag in the HTML `<head>` or a CSS `@import` rule.

All fonts are served via Google's high-speed global content delivery network, automatically serving modern formats like WOFF2 and tailoring font subsets based on the visitor's browser.

---

## Key Highlights & Features

1. **Massive Font Library**: Over 1,500 open-source font families covering hundreds of languages and writing systems.
2. **Variable Fonts**: Granular control over weight, width, and optical size using a single, efficient font file.
3. **Material Symbols & Icons**: Thousands of vector icons across Outlined, Rounded, and Sharp styles.
4. **Automatic Optimization**: Delivers compressed WOFF2 files and localized character subsets for fast loading.
5. **100% Free**: Licensed under open-source licenses (SIL Open Font License, Apache 2.0, or Ubuntu Font License) for personal and commercial projects.

---

## How It Works with Static Websites

Include font stylesheets in your static HTML document `<head>` with preconnect resource hints:

```html
<!-- Preconnect to font domains to speed up DNS and TLS handshakes -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Load the font family with desired weights -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

Then apply the font family in your CSS:

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

---

## When to Use It

1. Quick and easy typography integration on static blogs, landing pages, and documentation sites.
2. Projects needing a vast selection of multilingual fonts or modern variable typography without self-hosting assets.
3. Prototyping and developing web designs with instant access to Google's Material Symbols and icons.
