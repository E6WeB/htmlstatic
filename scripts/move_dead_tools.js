// ==========================================================================
// StaticStack Dead Tool Mover
// Reads asset/json/link-health.json and moves tools that have failed
// N consecutive health checks (default: 2) into the ## Inactive section.
// Usage: node scripts/move_dead_tools.js [--threshold=2] [--dry-run]
// ==========================================================================

const fs = require('fs');
const path = require('path');
const { loadCatalog } = require('../src/data/parse-readme');

const ROOT_DIR = path.resolve(__dirname, '..');
const README_PATH = path.join(ROOT_DIR, 'README.md');
const HEALTH_FILE = path.join(ROOT_DIR, 'asset', 'json', 'link-health.json');
const ALLOWLIST_FILE = path.join(__dirname, 'link-check-allowlist.json');

function parseArgs(argv) {
  let threshold = 2;
  let dryRun = false;
  for (const arg of argv) {
    if (arg.startsWith('--threshold=')) {
      const parsed = parseInt(arg.split('=')[1], 10);
      if (!Number.isNaN(parsed) && parsed >= 1) threshold = parsed;
    } else if (arg === '--dry-run') {
      dryRun = true;
    }
  }
  return { threshold, dryRun };
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function loadAllowlist() {
  if (!fs.existsSync(ALLOWLIST_FILE)) return new Set();
  try {
    const data = JSON.parse(fs.readFileSync(ALLOWLIST_FILE, 'utf8'));
    return new Set(Array.isArray(data) ? data : []);
  } catch {
    return new Set();
  }
}

function moveToolRowInReadme(readmeContent, tool) {
  const oldRelPath = `tools/${tool.categorySlug}/${tool.slug}.md`;
  const newRelPath = `tools/inactive/${tool.slug}.md`;

  const rowPattern = new RegExp(
    `[ \\t]*<tr>[\\s\\S]*?href=["']${escapeRegExp(oldRelPath)}["'][\\s\\S]*?<\\/tr>\\r?\\n?`,
    'i'
  );

  const match = readmeContent.match(rowPattern);
  if (!match) {
    return { updated: readmeContent, moved: false };
  }

  const rawRow = match[0].replace(/\r?\n$/, '');
  const updatedRow = rawRow.replace(
    new RegExp(escapeRegExp(oldRelPath), 'g'),
    newRelPath
  );

  let updated = readmeContent.replace(match[0], '');

  const inactiveIdx = updated.indexOf('## Inactive');
  if (inactiveIdx === -1) {
    throw new Error('Could not find "## Inactive" section in README.md');
  }

  const tbodyEndIdx = updated.indexOf('</tbody>', inactiveIdx);
  if (tbodyEndIdx === -1) {
    throw new Error('Could not find "</tbody>" under "## Inactive" in README.md');
  }

  const lineEnding = updated.includes('\r\n') ? '\r\n' : '\n';
  updated =
    updated.slice(0, tbodyEndIdx) +
    updatedRow +
    lineEnding +
    updated.slice(tbodyEndIdx);

  return { updated, moved: true };
}

function moveToolAssets(tool, dryRun) {
  const srcDir = path.join(ROOT_DIR, 'tools', tool.categorySlug);
  const destDir = path.join(ROOT_DIR, 'tools', 'inactive');
  const candidates = [
    `${tool.slug}.md`,
    `${tool.slug}.html`,
    `${tool.slug}-icon.webp`,
    `${tool.slug}-cover.webp`
  ];

  const movedFiles = [];
  if (!dryRun && !fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  for (const filename of candidates) {
    const srcPath = path.join(srcDir, filename);
    const destPath = path.join(destDir, filename);
    if (fs.existsSync(srcPath)) {
      if (!dryRun) {
        fs.renameSync(srcPath, destPath);
      }
      movedFiles.push(`tools/${tool.categorySlug}/${filename} -> tools/inactive/${filename}`);
    }
  }
  return movedFiles;
}

function main() {
  const { threshold, dryRun } = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(HEALTH_FILE)) {
    console.log('No link-health.json found. Run scripts/check_links.js first.');
    return;
  }

  const healthMap = JSON.parse(fs.readFileSync(HEALTH_FILE, 'utf8'));
  const { allTools } = loadCatalog(ROOT_DIR);
  const allowlist = loadAllowlist();

  const candidates = allTools.filter(tool => {
    if (tool.categorySlug === 'inactive') return false;
    if (allowlist.has(tool.slug)) return false;
    const record = healthMap[tool.slug];
    return (
      record &&
      record.status === 'offline' &&
      (record.consecutive_failures || 0) >= threshold
    );
  });

  if (candidates.length === 0) {
    console.log(`No active tools reached >= ${threshold} consecutive failures.`);
    return;
  }

  console.log(
    `${dryRun ? '[DRY RUN] ' : ''}Found ${candidates.length} tool(s) with >= ${threshold} consecutive failures:`
  );

  let readmeContent = fs.readFileSync(README_PATH, 'utf8');
  const movedSummary = [];

  for (const tool of candidates) {
    const record = healthMap[tool.slug];
    const { updated, moved } = moveToolRowInReadme(readmeContent, tool);
    if (!moved) {
      console.warn(`⚠️  Could not locate table row for ${tool.name} (${tool.slug}) in README.md`);
      continue;
    }
    readmeContent = updated;
    const movedFiles = moveToolAssets(tool, dryRun);
    movedSummary.push({
      name: tool.name,
      slug: tool.slug,
      fromCategory: tool.categoryTitle,
      url: tool.websiteUrl,
      reason: record.error || `HTTP ${record.code}`,
      failures: record.consecutive_failures,
      files: movedFiles
    });
    console.log(
      `- ${tool.name} (${tool.categoryTitle}) -> Inactive [${record.error || `HTTP ${record.code}`}, ${record.consecutive_failures}x]`
    );
  }

  if (!dryRun && movedSummary.length > 0) {
    fs.writeFileSync(README_PATH, readmeContent, 'utf8');
    console.log(`\nUpdated README.md with ${movedSummary.length} moved tool(s).`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { moveToolRowInReadme };

