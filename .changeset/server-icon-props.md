---
'@meimberg/ui': minor
---

ESLint: neue Regel `meimberg/no-server-icon-props` (Plugin-Export `plugin`, Block-Helfer `serverComponentRules(files, {ignores, props})`). Sie meldet Icon-Komponenten (`icon`, `actionIcon`, `submitIcon`), die aus Dateien ohne `'use client'` übergeben werden — Next.js scheitert daran erst zur Laufzeit.
