# StaticStack Community — Feature Suggestions & Roadmap

This document outlines practical, high-impact suggestions to enhance the **StaticStack Community**. Suggestions are organized by implementation effort and priority, focusing on features that keep the platform lightweight, fast, and closely aligned with the Jamstack / zero-backend philosophy.

---

## ⚡ Quick Wins (Low Effort, High Impact)

Features that can be implemented in a few hours with minimal or no database schema changes:

### 1. Markdown Live Preview Tab
* **What**: Add a **Write / Preview** toggle tab to the "Start a Discussion" modal and "Reply" composer.
* **Why**: Users can preview their markdown formatting, links, and code blocks before publishing.
* **Implementation**:
  - Add two tab buttons above the textarea (`[ Write ]` and `[ Preview ]`).
  - Use the existing client-side `renderMarkdown()` function from `app.js` to render the input into a preview container.

### 2. Copy Code Block Button
* **What**: Add a small "Copy" icon/button to the top-right corner of code blocks (`<pre><code>`) in discussions and replies.
* **Why**: Community members frequently share snippets of HTML, CSS, JavaScript, and configuration files.
* **Implementation**:
  - Automatically wrap `<pre>` elements with a relative container during markdown rendering.
  - Inject a copy button that copies `code.innerText` using `navigator.clipboard.writeText()` and displays a brief "Copied!" tooltip.

### 3. Share Discussion & Copy Link
* **What**: Add a "Share" button to discussion headers and cards.
* **Why**: Makes it frictionless for users to share helpful discussions on social media, Discord, or GitHub.
* **Implementation**:
  - Clicking the button copies the deep-link (`/community/?topic=ID` or `#topic-ID`) to clipboard.
  - On mobile devices supporting `navigator.share`, invoke the native OS share sheet.

### 4. Relative Time Formatting ("3 hours ago")
* **What**: Convert absolute UTC dates (e.g., `Oct 28, 2026`) to dynamic relative times (e.g., `just now`, `25m ago`, `3h ago`, `4d ago`) with hover tooltips showing the full timestamp.
* **Why**: Gives discussions an active, real-time feel.
* **Implementation**:
  - A lightweight 10-line helper function: `formatRelativeTime(dateString)`.

### 5. "My Discussions" & Quick Filter Tabs
* **What**: Add quick filters above the topics list:
  - **All**
  - **Unanswered** (topics with 0 replies)
  - **Popular** (sorted by upvotes)
  - **My Discussions** (when logged in)
* **Why**: Allows users to quickly find unresolved questions or track their own posts.
* **Implementation**:
  - Client-side filtering when topics are cached in memory, or query params `?filter=unanswered` / `?filter=my`.

---

## 🎯 Medium-Term Enhancements (Core Community Features)

Features requiring small schema additions or minor backend API updates:

### 6. Pinned / Sticky Discussions
* **What**: Allow admins to pin key announcements or guidelines to the top of the discussion list.
* **Why**: Ensures new members see the rules, FAQs, and weekly showcase threads first.
* **Implementation**:
  - Add `is_pinned BOOLEAN DEFAULT FALSE` column to the `topics` table.
  - Sort query by `is_pinned DESC, created_at DESC`.
  - Add a "Pin/Unpin" toggle button for admin users next to the Delete button.

### 7. "Solved" / Accepted Answer Marker
* **What**: For topics in the **Help and Questions** channel, allow the topic author (or admin) to mark one reply as the "Accepted Solution".
* **Why**: Highlights correct solutions for future visitors and closes the support loop.
* **Implementation**:
  - Add `is_accepted BOOLEAN DEFAULT FALSE` to the `replies` table.
  - Add `is_resolved BOOLEAN DEFAULT FALSE` to `topics`.
  - Display a green "✓ Solution" badge on the accepted reply and a checkmark pill on the topic list card.

### 8. Author / Role Badges
* **What**: Visual badges next to author names in topics and replies:
  - **Admin** (e.g. `E6WeB` with a blue or purple shield badge)
  - **Author** (shows on replies written by the original topic author)
  - **Tool Creator** (for contributors whose tools are featured in the StaticStack directory)
* **Why**: Builds credibility and community identity.
* **Implementation**:
  - Simple conditional check: if `reply.author_id === topic.author_id`, display `<span class="badge-author">Author</span>`.
  - Admin badge for `author.is_admin === true`.

### 9. Lightweight Code Syntax Highlighting
* **What**: Clean syntax highlighting for code snippets (`js`, `html`, `css`, `bash`, `json`).
* **Why**: Improves readability when sharing code.
* **Implementation**:
  - Use a tiny build of Prism.js (or a minimal regex-based tokenizer) without adding heavy bundle size.
  - Automatically styled using the site's dark/light CSS variables.

### 10. Topic Locking
* **What**: Allow admins to lock discussions to prevent new replies on resolved or outdated threads.
* **Why**: Prevents spam or necroposting on legacy discussions.
* **Implementation**:
  - Add `is_locked BOOLEAN DEFAULT FALSE` to the `topics` table.
  - Disable the reply textarea and display a "This discussion is locked" alert when `is_locked` is true.

---

## 🚀 Directory & Ecosystem Integrations (StaticStack Synergy)

Features that bridge the StaticStack tool directory (110+ tools) with the community forum:

### 11. "Mention a Tool" Tagging
* **What**: Allow authors to link a discussion directly to an existing tool from the directory (e.g., Hugo, Astro, Formspree, Clerk).
* **Why**: Connects discussions directly to the tools people are using.
* **Implementation**:
  - An optional tool selector dropdown in the "Start Discussion" modal loaded from `asset/json/tools-data.json`.
  - Discussions display a clickable tool chip (e.g., `[📦 Astro]`) linking to `/tools/static-site-generators/astro.html`.

### 12. "Discuss in Community" Button on Tool Pages
* **What**: Add a "Discuss on Community" button to every single tool page in `tools/*/*.html`.
* **Why**: Drives traffic from tool directory visitors into active forum discussions about that tool.
* **Implementation**:
  - Generates a link to `/community/?channel=tools-components&tool=tool-slug` or pre-populates a new discussion draft with the tool pre-selected.

### 13. Weekly "Tool of the Week" Spotlight Thread
* **What**: A recurring or automated discussion highlighting one open-source or indie tool from the directory for community feedback and tips.
* **Why**: Keeps forum content fresh and engages makers whose tools are featured.

---

## 🛡️ Moderation & Quality of Life

### 14. Author Edit (Completed)
* **What**: Allow users to edit their own discussions anytime with an `(edited)` indicator (and admins can edit any discussion).
* **Status**: **Completed** — In-place topic editing with live title, channel, and body updates, validation, permissions, and `• (edited)` timestamp label.
* **Why**: Fixes typos, broken links, or formatting errors without having to delete and re-post.

### 15. Empty State Prompts
* **What**: When a channel or search result has no topics, display a friendly prompt with a direct "Be the first to start a conversation in this channel!" call-to-action button.
* **Why**: Encourages first contributions rather than showing a blank screen.

---

## 📊 Summary & Recommended Roadmap

| Phase | Features | Est. Complexity |
|---|---|---|
| **Phase 1 (Immediate)** | Live Markdown Preview, Copy Code Button, Relative Times, Share Button | ⚡ Very Low |
| **Phase 2 (Next)** | Pinned Discussions, "Solved" Answer Marker, Author/Admin Badges | 🎯 Low-Medium |
| **Phase 3 (Directory)** | Tool Mentions (`tools-data.json` integration), Tool Page Linkback | 🚀 Medium |
