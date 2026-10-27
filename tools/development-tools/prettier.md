# Prettier

> Opinionated code formatter for HTML, CSS, JavaScript, and Markdown.

- **Official Website**: <a href="https://prettier.io/" target="_blank" rel="noopener noreferrer">prettier.io</a>
- **Category**: [Development Tools](../../README.md#development-tools)
- **Type**: Code Formatter

---

## Overview

Prettier is an opinionated code formatter that supports HTML, CSS, SCSS, JavaScript, TypeScript, Markdown, and JSON. It eliminates all debates over code styling by parsing your code and re-printing it according to strict, clean formatting rules.

Using Prettier ensures consistent indentation, quotes, and line wrapping across all files in your repository.

---

## Key Highlights & Features

- **Opinionated & Consistent**: Saves time and stops debates over code style in pull requests.
- **Multi-Language Support**: Formats HTML, CSS, JavaScript, JSON, and Markdown files.
- **Editor Integration**: Automatically formats files whenever you save.
- **CI Validation**: Check that all files conform to formatting standards in continuous integration.

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

- Maintaining clean, uniform code styles across HTML, CSS, and JS files.
- Open-source projects accepting contributions to avoid style discrepancies in PRs.
