// @meimberg/ui/eslint — DS usage rules for consuming apps.
//
// Plain ESM, no build step, no plugin dependency: the rules are expressed
// with ESLint core rules (`no-restricted-imports`, `no-restricted-syntax`).
//
// ESLint flat config does not merge rule options: a later config object that
// sets `no-restricted-imports` / `no-restricted-syntax` for the same files
// replaces the earlier setting. Apps with their own restrictions therefore
// spread the building blocks into every block that sets these rules:
//
//   'no-restricted-imports': ['error', {
//     paths: [...restrictedImportPaths, ...appPaths],
//     patterns: [...restrictedImportPatterns, ...appPatterns],
//   }],
//   'no-restricted-syntax': ['error', ...restrictedSyntax, ...appSelectors],
//
// Apps without own restrictions use `recommended`. Escape hatch for a real
// exception: an inline disable with a reason, e.g.
//   // eslint-disable-next-line no-restricted-syntax -- native file input, no DS equivalent

/** Entries for `no-restricted-imports` → `paths`. */
export const restrictedImportPaths = [
  {
    name: 'lucide-react',
    message:
      'Import icons from `@meimberg/ui/atoms/icons` (Lucide re-export plus semantic aliases) and render them via `<Icon icon={X} size="…" />` from `@meimberg/ui`.',
  },
  {
    name: '@radix-ui/react-dialog',
    message:
      'Use `<FormDialog>` from `@meimberg/ui` for forms, or the primitives from `@meimberg/ui/ui/dialog` / `@meimberg/ui/ui/alert-dialog`.',
  },
  {
    name: '@meimberg/ui/ui/avatar',
    message:
      '`@meimberg/ui/ui/avatar` is a vendor primitive. Use `<Avatar>` from `@meimberg/ui` (size/shape/tone instead of className).',
  },
  {
    name: '@meimberg/ui/ui/calendar',
    message:
      '`@meimberg/ui/ui/calendar` is a vendor primitive. Use `<DatePicker>` from `@meimberg/ui`.',
  },
  {
    name: 'react-day-picker',
    message: 'Use `<DatePicker>` from `@meimberg/ui` instead of react-day-picker.',
  },
  {
    name: '@meimberg/ui/ui/sonner',
    message:
      'Import `Toaster` and `toast` from `@meimberg/ui` (root barrel), not from the vendor primitive.',
  },
]

/** Entries for `no-restricted-imports` → `patterns`. */
export const restrictedImportPatterns = [
  {
    // Path-based imports of a `KpiTile` module (relative or absolute); the
    // barrel import `@meimberg/ui` does not match.
    group: ['**/KpiTile'],
    message: 'Import `KpiTile` from `@meimberg/ui` (root barrel). App-local variants are not allowed.',
  },
  {
    // `@radix-ui/react-dialog` has its own, more specific path entry above.
    group: ['@radix-ui/*', '!@radix-ui/react-dialog'],
    message:
      'Radix primitives come from `@meimberg/ui/ui/*` (or a DS component). If a primitive is missing, add it to the DS instead of importing Radix directly.',
  },
]

/** Selector objects for `no-restricted-syntax`. */
export const restrictedSyntax = [
  {
    selector: "JSXOpeningElement[name.name='input']",
    message:
      'Raw `<input>` is not allowed. Use `<TextField>` from `@meimberg/ui` (or `@meimberg/ui/ui/input` for inline edits in lists). Rare native cases (type="file", type="color", …): inline disable with a reason.',
  },
  {
    selector: "JSXOpeningElement[name.name='textarea']",
    message: 'Raw `<textarea>` is not allowed. Use `<TextField as="textarea">` from `@meimberg/ui`.',
  },
  {
    selector: "JSXOpeningElement[name.name='select']",
    message:
      'Raw `<select>` is not allowed. Use `<Select>` from `@meimberg/ui` (form field or `variant="pill"`), or `<Combobox>` for searchable/rich lists.',
  },
  {
    selector: "JSXOpeningElement[name.name='h1'] > JSXAttribute[name.name='className'] > Literal[value=/\\bheading-1\\b/]",
    message:
      '`<h1 className="heading-1">` belongs in `<PageHeader>` from `@meimberg/ui`. Use its `leading` / `meta` slots for hero variants.',
  },
  {
    selector: 'Literal[value=/max-w-\\[1440px\\]/]',
    message:
      '`max-w-[1440px]` lives only in `<PageContainer>` from `@meimberg/ui`. Use `<PageContainer>` (default padding) or `<PageContainer padded={false}>`.',
  },
  {
    // The four card-frame classes in any order within one string literal.
    selector:
      'Literal[value=/\\bbg-card\\b(?=[^"]*\\bborder\\b)(?=[^"]*\\brounded-lg\\b)(?=[^"]*\\bshadow-card\\b)/]',
    message:
      'Inline card frame (bg-card + border + rounded-lg + shadow-card) is not allowed. Use `<DashboardCard>` from `@meimberg/ui` (padding="dashboard" | "compact" | "none") or `<Card>` from `@meimberg/ui/ui/card`.',
  },
  {
    selector: 'Literal[value=/\\bhover-lift\\b/]',
    message:
      '`hover-lift` is not part of the DS (no movement on hover). Use `<Card interactive>` or `<DashboardCard interactive>` from `@meimberg/ui`.',
  },
  {
    selector: "CallExpression[callee.name='setTheme']",
    message: 'Theme switching goes through `<ThemeToggle>` from `@meimberg/ui`; do not call `setTheme(...)` in app code.',
  },
]

/** Ready-made flat config for apps without own restriction lists. Needs a TS/JSX parser from the app config (e.g. eslint-config-next). */
export const recommended = [
  {
    name: '@meimberg/ui/recommended',
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {paths: restrictedImportPaths, patterns: restrictedImportPatterns},
      ],
      'no-restricted-syntax': ['error', ...restrictedSyntax],
    },
  },
]

export default recommended
