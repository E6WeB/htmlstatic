# ESLint

> Find and fix problems in your JavaScript code before deploying.

- **Official Website**: <a href="https://eslint.org/" target="_blank" rel="noopener noreferrer">eslint.org</a>
- **Category**: [Development Tools](../README.md#development-tools)
- **Type**: Static Code Linter

---

## Overview

ESLint is the standard static analysis tool for identifying and fixing problems in JavaScript code. It inspects your code for syntax errors, bug-prone patterns, anti-patterns, and style violations without executing the code.

For static websites utilizing vanilla JavaScript or modern frameworks, ESLint catches errors before they reach production.

---

## Key Highlights & Features

- **Error Prevention**: Detect undefined variables, syntax errors, and potential bugs early.
- **Customizable Rules**: Customize linting rules or adopt popular standards (Airbnb, Standard).
- **Automatic Fixing**: Automatically fix many common code errors with the `--fix` flag.
- **Modern Standards**: Support for ES2024+, modules, and modern browser APIs.

---

## How It Works with Static Websites

Initialize and run ESLint in your project:

```bash
# Initialize ESLint
npm init @eslint/config@latest

# Run linting across JavaScript files
npx eslint . --fix
```

---

## When to Use It

- Static websites with client-side JavaScript logic, forms, or interactive components.
- Preventing subtle browser bugs and maintaining modern JavaScript best practices.
