# Changesets

Versionierung + Changelog für `@meimberg/ui`. Ablauf pro Änderung:

1. `pnpm changeset` — Änderung beschreiben, Bump-Level wählen (patch/minor/major).
2. `pnpm release:version` — sammelt offene Changesets, bumpt `package.json`,
   schreibt `CHANGELOG.md`.
3. Commit + Tag (`git tag v<version>`), push.

Distribution derzeit als **git-Dependency** (Consumer pinnen auf den Tag) — kein
npm-Registry-Publish (`private: true`). Wird später ein Registry ergänzt,
kommt hier `pnpm changeset publish` dazu.

Doku: https://github.com/changesets/changesets
