import {RuleTester} from 'eslint'
import {describe, it} from 'vitest'
import {plugin} from './index.mjs'

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
  languageOptions: {ecmaVersion: 2022, sourceType: 'module', parserOptions: {ecmaFeatures: {jsx: true}}},
})

tester.run('no-server-icon-props', plugin.rules['no-server-icon-props'], {
  valid: [
    // Client-Komponente: Komponenten-Referenzen sind erlaubt.
    `'use client'\nexport default () => <EmptyState icon={Inbox} title="x" />`,
    // Server-Komponente ohne Icon-Prop bzw. mit Nicht-Komponenten-Wert.
    `export default () => <EmptyState title="x" />`,
    `export default () => <EmptyState icon={iconFor(kind)} title="x" />`,
    // Fremde Props mit Komponenten-Wert bleiben unberührt.
    `export default () => <Chart renderer={Bars} />`,
  ],
  invalid: [
    {
      code: `export default () => <EmptyState icon={Inbox} title="x" />`,
      errors: [{messageId: 'serverIcon'}],
    },
    {
      code: `export default () => <PageHeader title="x" actionIcon={Icons.Plus} />`,
      errors: [{messageId: 'serverIcon'}],
    },
    {
      code: `'use server'\nexport default () => <FormDialog submitIcon={Check} />`,
      errors: [{messageId: 'serverIcon'}],
    },
    {
      code: `export default () => <Row glyph={Star} />`,
      options: [{props: ['glyph']}],
      errors: [{messageId: 'serverIcon'}],
    },
  ],
})
