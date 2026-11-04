# OpenCode

> Open-source AI coding agent available as an interactive terminal interface (TUI) and editor extension.

1. **Official Website**: <a href="https://opencode.ai/" target="_blank" rel="noopener noreferrer">opencode.ai</a>
2. **Category**: [Development Tools](../../README.md#development-tools)
3. **Type**: AI Coding Agent (CLI & IDE Extensions)
4. **Pricing / License**: Open Source

- **Tags**: `opencode`, `open-source-claude-code`, `terminal-ai-agent`, `tui-coding-assistant`, `multi-provider-llm`, `local-coding-agent`, `ai-coding-agent`, `vibe-coding`, `code-editor`, `web-performance`
---

## Overview

OpenCode is an open-source AI coding agent built to give developers full freedom over their AI models and environments. It runs as a terminal application featuring a rich Terminal User Interface (TUI) and provides companion extensions for major code editors like VS Code, Cursor, and JetBrains IDEs.

With native support for a wide variety of AI providers (Anthropic, OpenAI, Google Gemini, Ollama, and local models), OpenCode excels at editing code, navigating file structures, and executing tasks across static web projects.

---

## Key Highlights & Features

1. **Terminal User Interface (TUI)**: Beautiful, responsive keyboard-driven interface built with Bubble Tea.
2. **Multi-Model Flexibility**: Connect to OpenAI, Anthropic Claude, Gemini, or self-hosted open-weights models via Ollama.
3. **Editor Extensions**: Seamlessly switch between standalone CLI sessions and embedded editor panels in VS Code or Cursor.
4. **Non-Interactive Batch Mode**: Run one-off scripting tasks via `opencode run "..."` for CI/CD and automation scripts.
5. **LSP Code Intelligence**: Uses Language Server Protocols to understand project dependencies and syntax rules accurately.

---

## Example Usage with Static Websites

### Launching the Terminal Interface
```bash
opencode
```

### Running a Quick Refactor Task
```bash
opencode run "Extract all inline CSS styles from index.html into a clean styles.css file and link it in the header"
```

---

## When to Use It

1. Developers seeking an open-source, privacy-first alternative to proprietary AI coding tools.
2. Those who want to use local or specialized LLMs for code editing without cloud lock-in.
3. Teams wanting both a fast terminal agent and editor extension integration.
