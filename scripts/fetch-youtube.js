#!/usr/bin/env node
// ==========================================================================
// StaticStack YouTube Video Metadata & Tool Generator
// Usage: node scripts/fetch-youtube.js <youtube-url-or-id> [--category=tutorials] [--save]
// ==========================================================================

const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
  });
}

function extractVideoId(input) {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/|\/v\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

async function getYouTubeMetadata(videoId) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;

  let oembed = {};
  try {
    const rawOembed = await fetchUrl(oembedUrl);
    oembed = JSON.parse(rawOembed);
  } catch (err) {
    console.warn('oEmbed fetch warning:', err.message);
  }

  const html = await fetchUrl(videoUrl);

  let description = '';
  const needle = 'ytInitialPlayerResponse = ';
  const idx = html.indexOf(needle);
  if (idx !== -1) {
    const start = idx + needle.length;
    let depth = 0;
    let end = start;
    let inString = false;
    let escape = false;

    for (let i = start; i < html.length; i++) {
      const c = html[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (c === '\\') {
        escape = true;
        continue;
      }
      if (c === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (c === '{') depth++;
        else if (c === '}') {
          depth--;
          if (depth === 0) {
            end = i + 1;
            break;
          }
        }
      }
    }

    try {
      const playerObj = JSON.parse(html.substring(start, end));
      description = playerObj?.videoDetails?.shortDescription || '';
    } catch {}
  }

  if (!description) {
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    if (descMatch) description = descMatch[1];
  }

  return {
    videoId,
    videoUrl,
    title: oembed.title || 'YouTube Video',
    authorName: oembed.author_name || 'Creator',
    authorUrl: oembed.author_url || '',
    thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    description: description.trim()
  };
}

async function main() {
  const args = process.argv.slice(2);
  const input = args.find(a => !a.startsWith('--'));
  if (!input) {
    console.error('Usage: node scripts/fetch-youtube.js <youtube-url-or-id> [--category=tutorials] [--save]');
    process.exit(1);
  }

  const videoId = extractVideoId(input);
  if (!videoId) {
    console.error('Could not determine YouTube Video ID from input:', input);
    process.exit(1);
  }

  const saveFlag = args.includes('--save');
  const catArg = args.find(a => a.startsWith('--category='));
  const category = catArg ? catArg.split('=')[1] : 'tutorials';

  console.log(`Fetching metadata for video: ${videoId}...`);
  const meta = await getYouTubeMetadata(videoId);

  const slug = slugify(`${meta.authorName}-${meta.title}`);
  const mdFileName = `${slug}.md`;
  const targetDir = path.join(__dirname, '..', 'tools', category);
  const targetPath = path.join(targetDir, mdFileName);

  // Split description paragraphs
  const paragraphs = meta.description
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  const firstParagraph = paragraphs[0] || meta.title;
  const remainingDesc = paragraphs.slice(1).join('\n\n');

  // Format markdown
  const markdownContent = `# ${meta.title}

> ${firstParagraph}

1. **Official Website**: <a href="${meta.videoUrl}" target="_blank" rel="noopener noreferrer">${meta.videoUrl}</a>
2. **Category**: [${category.charAt(0).toUpperCase() + category.slice(1)}](../../README.md#${category})
3. **Type**: Video Tutorial & Architectural Guide (${meta.authorName})
4. **Pricing / License**: Free

- **Tags**: \`youtube-video\`, \`${slugify(meta.authorName)}\`, \`video-tutorial\`, \`static-web-guide\`, \`jamstack-tutorial\`
---

## Video Walkthrough

<div class="video-container" style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:var(--radius-lg); margin-bottom:1.5rem; box-shadow:var(--shadow-card); background:#000;">
  <iframe src="https://www.youtube-nocookie.com/embed/${meta.videoId}" title="${meta.title.replace(/"/g, '&quot;')}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;"></iframe>
</div>

---

## Overview

${remainingDesc || firstParagraph}

---

## Creator Information

- **Channel**: [${meta.authorName}](${meta.authorUrl})
- **Watch on YouTube**: [${meta.videoUrl}](${meta.videoUrl})
`;

  // Format README.md table row
  const shortTitle = meta.title.length > 55 ? meta.title.slice(0, 52) + '...' : meta.title;
  const shortSummary = firstParagraph.length > 120 ? firstParagraph.slice(0, 117) + '...' : firstParagraph;
  const readmeRow = `  <tr>
    <td><a href="tools/${category}/${mdFileName}">${shortTitle}</a></td>
    <td>${shortSummary.replace(/\n/g, ' ')}</td>
    <td><img src="https://img.shields.io/badge/Free-1a7f37?style=flat-square" alt="Free"></td>
    <td><a href="${meta.videoUrl}" target="_blank" rel="noopener noreferrer">youtube.com</a></td>
  </tr>`;

  console.log('\n================ Generated Markdown ================');
  console.log(markdownContent);
  console.log('\n================ README.md Table Row ===============');
  console.log(readmeRow);

  if (saveFlag) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(targetPath, markdownContent, 'utf8');
    console.log(`\n[SUCCESS] Saved markdown to: ${targetPath}`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

