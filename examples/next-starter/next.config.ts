import type { NextConfig } from 'next'

// @meimberg/ui wird als TypeScript-Quelle ausgeliefert und von der App gebaut.
const nextConfig: NextConfig = {
  transpilePackages: ['@meimberg/ui'],
  // Nur fürs Beispiel im DS-Repo nötig: sonst hält Turbopack das Lockfile des
  // DS-Repos für den Workspace-Root. Eine eigenständige App braucht das nicht.
  turbopack: { root: import.meta.dirname },
}

export default nextConfig
