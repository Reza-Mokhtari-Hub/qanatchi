import fs from 'node:fs';
import path from 'node:path';
import { build, transform } from 'esbuild';

const rootDir = process.cwd();
const entryFile = path.resolve(rootDir, 'edge/worker.ts');
const outDir = path.resolve(rootDir, 'dist-edge');
const outFile = path.resolve(outDir, 'worker.js');

const FORBIDDEN_PATTERNS = [
  { label: 'Node built-in import (node:*)', regex: /\bnode:[a-z0-9_/-]+/i },
  { label: 'CommonJS require()', regex: /\brequire\s*\(/ },
  { label: 'process.env access', regex: /\bprocess\.env\b/ },
  { label: 'Express framework reference', regex: /\bexpress\b/ },
  { label: 'Cloudflare KV/R2/DO bindings', regex: /\b(KVNamespace|DurableObject|R2Bucket|CF-Connecting-IP)\b/ },
  { label: 'Test-only in-memory storage adapter', regex: /\bInMemoryTestStorageAdapter\b/ },
  { label: 'Hardcoded dev/secret string', regex: /\b(GEMINI_API_KEY|localhost:3000)\b/ },
  { label: 'Dynamic code execution', regex: /\b(eval\s*\(|new\s+Function\s*\()/ },
];

async function run() {
  fs.mkdirSync(outDir, { recursive: true });

  const bundled = await build({
    entryPoints: [entryFile],
    write: false,
    bundle: true,
    format: 'iife',
    platform: 'neutral',
    target: 'es2020',
    mainFields: ['module', 'main'],
    conditions: ['worker', 'browser', 'import'],
    minify: true,
    charset: 'ascii',
    sourcemap: false,
  });

  // Format across clean ASCII-only lines so browser editors/uploaders never choke on a 90KB single line
  const formatted = await transform(bundled.outputFiles[0].text, {
    loader: 'js',
    minifyIdentifiers: false,
    minifySyntax: false,
    minifyWhitespace: false,
    charset: 'ascii',
  });

  const banner = '/* QANATCHI ArvanCloud Edge API Bundle (API v1) - Pure Web Fetch Standard */\n';
  const bundledCode = `${banner}${formatted.code}`;
  fs.writeFileSync(outFile, bundledCode, 'utf8');

  const violations = [];
  for (const check of FORBIDDEN_PATTERNS) {
    if (check.regex.test(bundledCode)) {
      violations.push(check.label);
    }
  }

  if (violations.length > 0) {
    console.error('Edge bundle compatibility audit FAILED:', violations.join(', '));
    process.exit(1);
  }

  const sizeKb = (Buffer.byteLength(bundledCode, 'utf8') / 1024).toFixed(2);
  console.log(`ArvanCloud Edge bundle built cleanly: dist-edge/worker.js (${sizeKb} KiB)`);
  console.log('Compatibility audit PASSED: 0 Node/Express/process.env/Cloudflare/test-adapter references.');
}

run().catch((err) => {
  console.error('Edge build failed:', err);
  process.exit(1);
});
