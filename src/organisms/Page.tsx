// Page — das Seiten-Skelett jeder Top-Level-Route: `PageContainer` >
// `PageHeader` > Inhalt. Apps komponieren Seiten über `Page` bzw. `ListPage`
// statt `PageContainer`/`PageHeader` von Hand zu stapeln — so kann der Header
// nicht außerhalb des Containers landen (siehe `pageCompositionPaths` in
// `@meimberg/ui/eslint`).
//
// `contained={false}`, wenn ein Layout den Container schon stellt (z. B. eine
// Settings-Shell mit `SubNavLayout`): dann ohne `PageContainer`, der Header
// bleibt derselbe.

import type {HTMLAttributes, ReactNode} from 'react'
import {PageContainer} from '../atoms/PageContainer'
import {PageHeader} from '../molecules/PageHeader'

export interface PageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  title: ReactNode
  /** Untertitel unter dem Titel (String oder JSX mit Inline-Counts/Highlights). */
  description?: ReactNode
  /** Glyph/Avatar vor dem Titelblock. */
  leading?: ReactNode
  /** Zeile unter der Beschreibung (Badges, Meta-Infos). */
  meta?: ReactNode
  /** Action-Bereich rechts im Header — die primäre Anlegen-Aktion („New …") und ggf. Header-Buttons. */
  actions?: ReactNode
  /** Default `true`: umschließt die Seite mit `PageContainer`. `false`, wenn ein Layout den Container stellt. */
  contained?: boolean
  children?: ReactNode
}

export function Page({
  title,
  description,
  leading,
  meta,
  actions,
  contained = true,
  children,
  ...rest
}: PageProps) {
  const body = (
    <>
      <PageHeader title={title} description={description} leading={leading} meta={meta}>
        {actions}
      </PageHeader>
      {children}
    </>
  )
  return contained
    ? <PageContainer data-slot="page" {...rest}>{body}</PageContainer>
    : <div data-slot="page" {...rest}>{body}</div>
}
