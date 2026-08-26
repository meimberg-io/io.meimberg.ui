---
'@meimberg/ui': patch
---

EditableInlineHeading: Fokus-Verlust speichert den Entwurf, statt ihn zu
verwerfen. Bisher wurde nur bei Enter oder Klick auf den ✓-Button gespeichert —
wer einen neuen Titel tippte und dann direkt eine andere Aktion im selben Dialog
anklickte, verlor die Eingabe kommentarlos. Der Save läuft jetzt auch bei
`focusout` der Edit-Zeile; wandert der Fokus innerhalb der Zeile (Save-/Cancel-
Button), bleibt das Verhalten unverändert.
