---
'@meimberg/ui': minor
---

Neuer Export `@meimberg/ui/eslint`: die DS-Nutzungsregeln für Apps als Bausteine (`restrictedImportPaths`, `restrictedImportPatterns`, `restrictedSyntax`) plus fertiges Flat-Config-Array `recommended` (auch Default-Export). Deckt `lucide-react` nur über `atoms/icons`, rohe `<input>`/`<textarea>`/`<select>`, `heading-1`-Titel, `max-w-[1440px]`, Inline-Card-Frames, `hover-lift`, `setTheme`, Vendor-Primitives mit DS-Wrapper (`ui/avatar`, `ui/calendar`, `ui/sonner`, `react-day-picker`), direkte Radix-Importe und pfadbasierte `KpiTile`-Importe ab. Apps mit eigenen Restriktionslisten spreaden die Bausteine in jeden Block (Flat Config merged Rule-Optionen nicht), siehe README § ESLint-Regeln für Apps. Der Next-Starter lintet mit `recommended` (`pnpm lint`).
