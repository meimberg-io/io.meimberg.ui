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
      '`<h1 className="heading-1">` belongs in the page header. Compose pages with `<Page>` / `<ListPage>` from `@meimberg/ui` (`leading` / `meta` slots for hero variants).',
  },
  {
    selector: 'Literal[value=/max-w-\\[1440px\\]/]',
    message:
      '`max-w-[1440px]` lives only in `<PageContainer>` from `@meimberg/ui`. Compose pages with `<Page>` / `<ListPage>` (they bring the container), otherwise `<PageContainer>` / `<PageContainer padded={false}>`.',
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

/**
 * Entries for `no-restricted-imports` → `paths`: page files compose the page
 * skeleton via `Page` / `ListPage` instead of stacking `PageContainer` and
 * `PageHeader` by hand. Opt-in, because it only applies to the app's route
 * files (e.g. Next `app/**`); components that intentionally render a
 * `PageHeader` inside an existing container (hero headers) stay outside the
 * file set or are listed in `ignores`. `FilterBar` stays allowed — its slots
 * fix the control order.
 */
export const pageCompositionPaths = [
  {
    name: '@meimberg/ui',
    importNames: ['PageHeader'],
    message:
      'Pages use `<Page>` / `<ListPage>` from `@meimberg/ui` (props `title`, `description`, `leading`, `meta`, `actions`) instead of `<PageHeader>`.',
  },
  {
    name: '@meimberg/ui',
    importNames: ['PageContainer'],
    message:
      'Pages use `<Page>` / `<ListPage>` from `@meimberg/ui`; they bring the `PageContainer` (`contained={false}` when a layout already provides it).',
  },
]

/**
 * Flat-config block for the page-composition rule. Carries the base DS lists
 * as well, because a later `no-restricted-imports` setting replaces an
 * earlier one for the same files: place it after `recommended`.
 *
 *   ...pageComposition(['app/**\/*.tsx'], {ignores: ['app/**\/_components/**']})
 *
 * @param {string[]} files Globs of the app's route/page files.
 * @param {{ignores?: string[]}} [options] Globs exempt from the rule (hero components etc.).
 */
export function pageComposition(files, {ignores = []} = {}) {
  return [
    {
      name: '@meimberg/ui/page-composition',
      files,
      ignores,
      rules: {
        'no-restricted-imports': [
          'error',
          {paths: [...restrictedImportPaths, ...pageCompositionPaths], patterns: restrictedImportPatterns},
        ],
      },
    },
  ]
}

/** Ready-made flat config for apps without own restriction lists. Needs a TS/JSX parser from the app config (e.g. eslint-config-next). */
// Icon-Props der DS-Komponenten (`icon`, `actionIcon`, `submitIcon`) sind
// Komponenten-Referenzen. Eine Server-Komponente kann eine Funktion nicht an
// eine Client-Komponente übergeben — Next.js bricht dann erst zur Laufzeit ab
// ("Functions cannot be passed directly to Client Components"), Build und
// Typecheck merken nichts. Die Regel meldet solche Übergaben in Dateien ohne
// `'use client'`. Abhilfe: das Stück in eine eigene Client-Komponente ziehen
// (oder, wenn die Datei ohnehin nur aus Client-Code importiert wird,
// `'use client'` ergänzen).
const DEFAULT_ICON_PROPS = ['icon', 'actionIcon', 'submitIcon']

function isUseClient(program) {
  return program.body.some(
    node => node.type === 'ExpressionStatement' && node.directive === 'use client',
  )
}

/** Komponenten-Referenz: `Inbox`, `Icons.Inbox` (Großbuchstabe am Ende). */
function isComponentRef(expr) {
  if (expr.type === 'Identifier') return /^[A-Z]/.test(expr.name)
  if (expr.type === 'MemberExpression' && !expr.computed && expr.property.type === 'Identifier') {
    return /^[A-Z]/.test(expr.property.name)
  }
  return false
}

const noServerIconProps = {
  meta: {
    type: 'problem',
    docs: {description: 'Disallow passing icon components from Server Components to @meimberg/ui client components.'},
    schema: [
      {
        type: 'object',
        properties: {props: {type: 'array', items: {type: 'string'}}},
        additionalProperties: false,
      },
    ],
    messages: {
      serverIcon:
        '`{{prop}}={{{name}}}` passes a component from a Server Component to a client component — Next.js fails at runtime. Move this JSX into a client component, or add `\'use client\'` if the file is only imported from client code.',
    },
  },
  create(context) {
    const props = new Set(context.options[0]?.props ?? DEFAULT_ICON_PROPS)
    let server = false
    return {
      Program(node) {
        server = !isUseClient(node)
      },
      JSXAttribute(node) {
        if (!server || node.name.type !== 'JSXIdentifier' || !props.has(node.name.name)) return
        const value = node.value
        if (!value || value.type !== 'JSXExpressionContainer' || !isComponentRef(value.expression)) return
        context.report({
          node,
          messageId: 'serverIcon',
          data: {prop: node.name.name, name: context.sourceCode.getText(value.expression)},
        })
      },
    }
  },
}

/** ESLint-Plugin mit den DS-eigenen Regeln (`meimberg/<regel>`). */
export const plugin = {
  meta: {name: '@meimberg/ui'},
  rules: {'no-server-icon-props': noServerIconProps},
}

/**
 * Flat-Config-Block für Next-Route-Dateien (z. B. `app/**\/*.tsx`): meldet
 * Icon-Komponenten, die aus Server-Komponenten an Client-Komponenten gehen.
 * Opt-in wie `pageComposition`, weil er vom Datei-Layout der App abhängt.
 */
export function serverComponentRules(files, {ignores = [], props} = {}) {
  return [
    {
      name: '@meimberg/ui/server-components',
      files,
      ignores,
      plugins: {meimberg: plugin},
      rules: {'meimberg/no-server-icon-props': ['error', props ? {props} : {}]},
    },
  ]
}

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
