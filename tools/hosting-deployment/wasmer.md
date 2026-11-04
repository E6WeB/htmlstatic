# Wasmer

> Host and deploy static websites and WebAssembly applications at the edge.

1. **Official Website**: <a href="https://wasmer.io/" target="_blank" rel="noopener noreferrer">wasmer.io</a>
2. **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
3. **Type**: Edge Hosting & WebAssembly Platform
4. **Pricing / License**: Freemium

- **Tags**: `wasmer-edge`, `webassembly-cloud`, `winterjs`, `wasm-hosting`, `ultra-fast-edge-server`, `static-and-edge-apps`, `free-static-hosting`, `edge-cdn`, `git-deploy`, `jamstack-hosting`
---

## Overview

Wasmer is a lightweight, edge-ready platform that allows developers to run and deploy applications, static assets, and WebAssembly packages globally. It provides sub-millisecond cold starts and distributed deployment without traditional virtual machines or container overhead.

For static website creators, Wasmer provides a seamless way to deploy static files and edge-rendered assets worldwide with unified package management and zero server maintenance.

---

## Key Highlights & Features

1. **Global Edge Network**: Deploy static sites and edge applications close to your visitors.
2. **Sub-Millisecond Cold Starts**: Lightning-fast performance powered by WebAssembly runtimes.
3. **Simple CLI Workflows**: Deploy directly from the command line using the Wasmer CLI.
4. **Unified Registry**: Publish and consume portable packages and web components.

---

## How It Works with Static Websites

You can initialize and deploy a static site using the Wasmer CLI:

```bash
# Install Wasmer CLI
curl https://get.wasmer.io -sSfL | sh

# Deploy current directory
wasmer deploy
```

You can also define a `wasmer.toml` configuration in your repository:

```toml
[package]
name = "my-static-site"
version = "1.0.0"

[fs]
"/public" = "public"
```

---

## When to Use It

1. Deploying lightweight static sites alongside WebAssembly modules.
2. Projects requiring instant global deployment and distributed edge execution.
3. Teams looking for an alternative to traditional container and server hosting.
