import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/** Best-effort remove of `dist.__trash.*` left by scripts/clean-dist.mjs */
function cleanDistTrash() {
  return {
    name: 'clean-dist-trash',
    closeBundle() {
      const root = process.cwd()
      let names = []
      try {
        names = fs.readdirSync(root)
      } catch {
        return
      }
      for (const name of names) {
        if (!name.startsWith('dist.__trash.')) continue
        const full = path.join(root, name)
        try {
          fs.rmSync(full, { recursive: true, force: true })
        } catch {
          /* may still be locked; user can delete folder manually */
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cleanDistTrash()],
})
