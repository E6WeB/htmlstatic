# Prettier

> Opinionated code formatter for HTML, CSS, JavaScript, and Markdown.

1. **Official Website**: <a href="https://prettier.io/" target="_blank" rel="noopener noreferrer">prettier.io</a>
2. **Category**: [Development Tools](../../README.md#development-tools)
3. **Type**: Code Formatter
4. **Pricing / License**: Open Source

- **Tags**: `prettier`, `opinionated-code-formatter`, `auto-format-html-css-js`, `clean-code-style`, `editor-save-format`, `ai-coding-agent`, `vibe-coding`, `code-editor`, `web-performance`, `core-web-vitals`
---

## Overview

Prettier is an opinionated code formatter that supports HTML, CSS, SCSS, JavaScript, TypeScript, Markdown, and JSON. It eliminates all debates over code styling by parsing your code and re-printing it according to strict, clean formatting rules.

Using Prettier ensures consistent indentation, quotes, and line wrapping across all files in your repository.

---

## Key Highlights & Features

1. **Opinionated & Consistent**: Saves time and stops debates over code style in pull requests.
2. **Multi-Language Support**: Formats HTML, CSS, JavaScript, JSON, and Markdown files.
3. **Editor Integration**: Automatically formats files whenever you save.
4. **CI Validation**: Check that all files conform to formatting standards in continuous integration.

---

## How It Works with Static Websites

Install and run Prettier via npx:

```bash
# Check formatting
npx prettier --check .

# Automatically fix formatting across all files
npx prettier --write .
```

Example `.prettierrc` configuration:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## When to Use It

1. Maintaining clean, uniform code styles across HTML, CSS, and JS files.
2. Open-source projects accepting contributions to avoid style discrepancies in PRs.
