import type { MarkdownComponents } from '@tanstack/markdown/react'
import type { ComponentProps } from 'react'
import { spriteManifest } from '../../../generated/sprite-manifest'
import { PixelAnimation } from '../../shared/pixel-animation'
import { PixelSprite } from '../../shared/pixel-sprite'
import type { PixelSpriteName } from '../../shared/pixel-sprite'

type DirectiveAttributes = {
  'data-difficulty'?: string
  'data-icon'?: string
  'data-pose'?: string
  'data-reward'?: string
}
type AsideProps = ComponentProps<'aside'> & DirectiveAttributes
type SectionProps = ComponentProps<'section'> & DirectiveAttributes

const isSpriteName = (name: string | undefined): name is PixelSpriteName =>
  name !== undefined && Object.hasOwn(spriteManifest, name)

export function TrainerTip({ children, className = '', ...props }: AsideProps) {
  const pose = props['data-pose']
  const name =
    pose === 'idle' ||
    pose === 'think' ||
    pose === 'question' ||
    pose === 'point'
      ? pose
      : 'teach'
  return (
    <aside
      {...props}
      aria-label="Trainer tip"
      role="note"
      className={`content-directive content-directive--trainer ${className}`.trim()}
    >
      <PixelAnimation name={name} scale={1.5} />
      <div className="content-directive__body">
        <p className="content-directive__label">Trainer tip</p>
        {children}
      </div>
    </aside>
  )
}

const note = (label: string, defaultIcon: PixelSpriteName) =>
  function ContentNote({ children, className = '', ...props }: AsideProps) {
    const icon = props['data-icon']
    return (
      <aside
        {...props}
        aria-label={label}
        role="note"
        className={`content-directive ${className}`.trim()}
      >
        <PixelSprite name={isSpriteName(icon) ? icon : defaultIcon} frame={0} />
        <div className="content-directive__body">
          <p className="content-directive__label">{label}</p>
          {children}
        </div>
      </aside>
    )
  }

const section = (label: string, defaultIcon: PixelSpriteName) =>
  function ContentSection({
    children,
    className = '',
    ...props
  }: SectionProps) {
    const reward = props['data-reward']
    return (
      <section
        {...props}
        aria-label={label}
        className={`content-directive ${className}`.trim()}
      >
        <PixelSprite
          name={isSpriteName(reward) ? reward : defaultIcon}
          frame={0}
        />
        <div className="content-directive__body">
          <p className="content-directive__label">{label}</p>
          {props['data-difficulty'] && (
            <p className="content-directive__difficulty">
              Difficulty: {props['data-difficulty']}
            </p>
          )}
          {children}
        </div>
      </section>
    )
  }

export const markdownComponents = {
  'content-trainer-tip': TrainerTip,
  'content-note': note('Note', 'content-note'),
  'content-warning': note('Warning', 'content-warning'),
  'content-remember': note('Remember', 'content-remember'),
  'content-quest': section('Quest', 'content-quest'),
  'content-challenge': section('Challenge', 'content-quest'),
  'content-exercise': section('Exercise', 'content-quest'),
  'content-quiz': section('Quiz', 'content-quest'),
  'content-reward': note('Reward', 'content-reward'),
  'content-badge': note('Badge', 'content-badge'),
  'content-success': note('Success', 'content-success'),
  'content-locked': note('Locked', 'content-locked'),
  'content-current': note('Current', 'content-current'),
  'content-code-example': section('Code example', 'content-terminal'),
  'content-terminal': section('Terminal', 'content-terminal'),
  'content-architecture': section('Architecture', 'content-architecture'),
  'content-resource': section('Resource', 'content-resource'),
} satisfies MarkdownComponents
