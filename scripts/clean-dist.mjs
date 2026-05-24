/**
 * Vite cannot empty `dist/` when files are locked (ENOTEMPTY). Renaming the folder sidesteps that;
 * Vite then writes a brand-new `dist/`. Old folders `dist.__trash.*` are removed after build (see vite.config).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  process.exit(0);
}

const trash = path.join(root, `dist.__trash.${Date.now()}`);
try {
  fs.renameSync(dist, trash);
} catch (err) {
  console.error('[clean-dist] Could not move dist/ aside:', err.message || err);
  console.error(
    '[clean-dist] Close anything using dist/ (e.g. vite preview, Finder preview), then delete dist/ manually.',
  );
  process.exit(1);
}
