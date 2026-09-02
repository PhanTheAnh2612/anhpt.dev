import type { MarkdownComponents } from '@tanstack/markdown/react'
import type { ComponentProps } from 'react'

type AsideProps = ComponentProps<'aside'>
type SectionProps = ComponentProps<'section'>

const note = (label: string) =>
  function ContentNote(props: AsideProps) {
    return <aside {...props} aria-label={label} role="note" />
  }

const section = (label: string) =>
  function ContentSection(props: SectionProps) {
    return <section {...props} aria-label={label} />
  }

export const markdownComponents = {
  'content-trainer-tip': note('Trainer tip'),
  'content-note': note('Note'),
  'content-warning': note('Warning'),
  'content-remember': note('Remember'),
  'content-quest': section('Quest'),
  'content-challenge': section('Challenge'),
  'content-exercise': section('Exercise'),
  'content-quiz': section('Quiz'),
  'content-reward': note('Reward'),
  'content-badge': note('Badge'),
  'content-success': note('Success'),
  'content-locked': note('Locked'),
  'content-current': note('Current'),
  'content-code-example': section('Code example'),
  'content-terminal': section('Terminal'),
  'content-architecture': section('Architecture'),
  'content-resource': section('Resource'),
} satisfies MarkdownComponents
