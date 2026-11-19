import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

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

  await build({
    entryPoints: [entryFile],
    outfile: outFile,
    bundle: true,
    format: 'iife',
    platform: 'neutral',
    target: 'es2022',
    mainFields: ['module', 'main'],
    conditions: ['worker', 'browser', 'import'],
    minify: true,
    sourcemap: false,
    charset: 'utf8',
    banner: {
      js: '/* QANATCHI ArvanCloud Edge API Bundle (API v1) - Pure Web Fetch Standard */',
    },
  });

  const bundledCode = fs.readFileSync(outFile, 'utf8');
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
