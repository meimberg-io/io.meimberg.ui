import {defineConfig, globalIgnores} from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import {recommended as meimbergUi} from '@meimberg/ui/eslint'

// eslint-config-next brings the TS/JSX parser; `@meimberg/ui/eslint` adds the
// DS usage rules. Apps with own `no-restricted-imports`/`no-restricted-syntax`
// lists spread `restrictedImportPaths`/`restrictedImportPatterns`/
// `restrictedSyntax` into their blocks instead (see DS README).
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  ...meimbergUi,
  globalIgnores(['.next/**', 'next-env.d.ts']),
])
