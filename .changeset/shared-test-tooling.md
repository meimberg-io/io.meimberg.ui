---
'@meimberg/ui': minor
---

Test-Tooling für Apps (Konsolidierung Phase 4, Schritt 2).

- `@meimberg/ui/testing/setup`: Vitest-Setup mit jest-dom-Matchern und jsdom-Polyfills (`matchMedia`, `ResizeObserver`, Pointer-Capture, `scrollIntoView`, Range-Rects); polyfillt nur, was fehlt.
- `@meimberg/ui/testing`: `renderWithUi(ui, options?)` rendert in `UiProviders` (Optionen `providers`, `messages`/`locale`/`dateLocale`, `withToaster`, `wrapper` für App-Provider) und liefert eine `userEvent`-Instanz `user` mit.
- Bin `meimberg-ui-check-stories`: Story-Coverage-Check für Apps (`--root`, `--src`, `--layers`, `--ignore`, `--ignore-dirs`, `--allowlist`), nimmt Server-Components aus.
- Neue optionale Peers für die Test-Exporte: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`.
