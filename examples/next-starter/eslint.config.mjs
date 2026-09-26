import {defineConfig, globalIgnores} from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import {pageComposition, recommended as meimbergUi, serverComponentRules} from '@meimberg/ui/eslint'

// eslint-config-next brings the TS/JSX parser; `@meimberg/ui/eslint` adds the
// DS usage rules. Apps with own `no-restricted-imports`/`no-restricted-syntax`
// lists spread `restrictedImportPaths`/`restrictedImportPatterns`/
// `restrictedSyntax` into their blocks instead (see DS README).
// `pageComposition` (after `recommended`) makes route files compose pages via
// `Page`/`ListPage` instead of `PageContainer` + `PageHeader`.
// `serverComponentRules` catches icon components passed from Server
// Components to DS client components (a runtime-only Next.js error).
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  ...meimbergUi,
  ...pageComposition(['app/**/*.tsx']),
  ...serverComponentRules(['app/**/*.tsx']),
  globalIgnores(['.next/**', 'next-env.d.ts']),
])
