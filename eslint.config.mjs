// @meimberg/ui — ESLint (PUL-462 AK 6).
//
// Kern: die DOMAIN-GRENZE. Das DS-Package muss domain-frei bleiben — kein
// Import aus dem App-Baum (`@/*`) und kein relativer Ausbruch nach `app/src`.
// Da das Package keinen `@/`-Alias kennt, würden solche Importe ohnehin nicht
// auflösen (tsc fängt es); diese Regel macht die Grenze explizit + gibt eine
// klare Meldung. Ergänzend die shadcn-Relaxations (Primitives sind as-is aus
// Upstream portiert, analog zum `src/components/ui/**`-Block der App-Config).
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  {ignores: ['storybook-static/**', 'examples/**']},
  ...tseslint.configs.recommended,
  // React-Hooks-Regeln (recommended) — die Primitives sind Client-Components;
  // exhaustive-deps & Co. gelten hier genauso wie in der App (PUL-462 Schritt 6).
  reactHooks.configs.flat['recommended-latest'],
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/*', '@/**'],
              message:
                'PUL-462 (AK 6): @meimberg/ui ist domain-frei — kein Import aus dem App-Baum (`@/*`). Package-relative Pfade nutzen oder @meimberg/ui/tokens.',
            },
            {
              group: ['**/app/src/**', '**/app/src/*'],
              message:
                'PUL-462 (AK 6): kein Import aus dem App-Baum (app/src) ins DS-Package.',
            },
            {
              // PUL-397/PUL-462: shadcn-<Calendar> ist ein Vendor-Primitive —
              // Konsumenten nutzen `<DatePicker>` (atoms/). Nur der Wrapper
              // darf das rohe Primitive importieren (Override unten).
              group: ['**/ui/calendar'],
              message:
                'PUL-397/PUL-464: `ui/calendar` ist ein Vendor-Primitive — nutze `<DatePicker>` (atoms/). Whitelist: atoms/DatePicker.tsx.',
            },
          ],
        },
      ],
      // shadcn-Primitives (as-is portiert) — Relaxations analog App-Config.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  // PUL-397/PUL-464: Whitelist — der Date-Wrapper darf sein Vendor-Primitive
  // importieren. Domain-Grenze (@/*, app/src) bleibt via der globalen Regel
  // bestehen; hier wird `no-restricted-imports` nur ohne die calendar-Sperre
  // neu deklariert (ESLint merged Rule-Optionen nicht).
  {
    files: ['src/atoms/DatePicker.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/*', '@/**'],
              message:
                'PUL-462 (AK 6): @meimberg/ui ist domain-frei — kein Import aus dem App-Baum (`@/*`).',
            },
            {
              group: ['**/app/src/**', '**/app/src/*'],
              message:
                'PUL-462 (AK 6): kein Import aus dem App-Baum (app/src) ins DS-Package.',
            },
          ],
        },
      ],
    },
  },
)
