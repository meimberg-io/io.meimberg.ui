# io.meimberg.ui — Claude Code Rules

Interne FE-Komponenten-Library (`@meimberg/ui`), konsumiert von Pulse
(`io.meimberg.pulse`) als gepinnter Git-Tag-Dependency
(`github:meimberg-io/io.meimberg.ui#vX.Y.Z`).

## Git — Push ist hier explizit erlaubt

**Ausnahme von der globalen never-push-Regel:** In diesem Repo darf Claude
`git push` selbst ausführen — insbesondere Version-Bumps und Tags
(`git push origin main --tags`).

Begründung:
1. **Kein Produktiv-Change.** Ein Push/Tag löst keinen Deploy aus. Konsumenten
   (Pulse) ziehen bewusst über einen gepinnten Tag — ein neuer Tag wird erst
   wirksam, wenn dort die Dependency-Version hochgezogen wird.
2. **Sonst bricht der Prozess.** Der Release-Flow (changeset version → commit →
   tag → push → im Konsumenten bumpen) muss durchlaufen; ein manueller
   Push-Stopp mittendrin unterbricht ihn unnötig.

Der Release-Ablauf: `pnpm release:version` (Changeset konsumieren, Bump,
CHANGELOG) → Commit „Version X.Y.Z" → `git tag vX.Y.Z` → `git push origin main --tags`.
