import { type HTMLAttributes, type ReactNode } from 'react'
import './LiquidGlassTypography.scss'

export type LiquidGlassTypographyLevel = 1 | 2 | 3 | 4 | 5

export interface LiquidGlassTypographyTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  level?: LiquidGlassTypographyLevel
  ellipsis?: boolean
  children?: ReactNode
}

export interface LiquidGlassTypographyTextProps
  extends HTMLAttributes<HTMLSpanElement> {
  type?: 'default' | 'secondary' | 'success' | 'warning' | 'danger'
  strong?: boolean
  italic?: boolean
  underline?: boolean
  delete?: boolean
  ellipsis?: boolean
  children?: ReactNode
}

export interface LiquidGlassTypographyParagraphProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ellipsis?: boolean
  children?: ReactNode
}

const TITLE_TAGS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
} as const

function LiquidGlassTypographyTitle({
  level = 1,
  ellipsis = false,
  className = '',
  children,
  ...props
}: LiquidGlassTypographyTitleProps) {
  const Tag = TITLE_TAGS[level]
  const classes = `liquid-glass-typography__title liquid-glass-typography__title--h${level}${ellipsis ? ' liquid-glass-typography--ellipsis' : ''}${className ? ` ${className}` : ''}`

  if (Tag === 'h1') return <h1 className={classes} {...props}>{children}</h1>
  if (Tag === 'h2') return <h2 className={classes} {...props}>{children}</h2>
  if (Tag === 'h3') return <h3 className={classes} {...props}>{children}</h3>
  if (Tag === 'h4') return <h4 className={classes} {...props}>{children}</h4>
  return <h5 className={classes} {...props}>{children}</h5>
}

function LiquidGlassTypographyText({
  type = 'default',
  strong = false,
  italic = false,
  underline = false,
  delete: deleted = false,
  ellipsis = false,
  className = '',
  children,
  ...props
}: LiquidGlassTypographyTextProps) {
  const typeClass = type === 'default' ? '' : ` liquid-glass-typography__text--${type}`
  return (
    <span
      className={`liquid-glass-typography__text${typeClass}${strong ? ' liquid-glass-typography__text--strong' : ''}${italic ? ' liquid-glass-typography__text--italic' : ''}${underline ? ' liquid-glass-typography__text--underline' : ''}${deleted ? ' liquid-glass-typography__text--delete' : ''}${ellipsis ? ' liquid-glass-typography--ellipsis' : ''}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </span>
  )
}

function LiquidGlassTypographyParagraph({
  ellipsis = false,
  className = '',
  children,
  ...props
}: LiquidGlassTypographyParagraphProps) {
  return (
    <p
      className={`liquid-glass-typography__paragraph${ellipsis ? ' liquid-glass-typography--ellipsis' : ''}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </p>
  )
}

export const LiquidGlassTypography = {
  Title: LiquidGlassTypographyTitle,
  Text: LiquidGlassTypographyText,
  Paragraph: LiquidGlassTypographyParagraph,
}

export default LiquidGlassTypography
