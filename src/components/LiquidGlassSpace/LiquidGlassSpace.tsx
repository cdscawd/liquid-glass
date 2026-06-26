import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import './LiquidGlassSpace.scss'

export type LiquidGlassSpaceSize = 'sm' | 'md' | 'lg'

export interface LiquidGlassSpaceProps extends HTMLAttributes<HTMLDivElement> {
  size?: LiquidGlassSpaceSize | number
  direction?: 'horizontal' | 'vertical'
  wrap?: boolean
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  split?: ReactNode
}

const SIZE_MAP: Record<LiquidGlassSpaceSize, number> = {
  sm: 8,
  md: 16,
  lg: 24,
}

export function LiquidGlassSpace({
  size = 'md',
  direction = 'horizontal',
  wrap = false,
  align,
  justify,
  split,
  className = '',
  style,
  children,
  ...props
}: LiquidGlassSpaceProps) {
  const gap = typeof size === 'number' ? size : SIZE_MAP[size]
  const dirClass =
    direction === 'vertical' ? ' liquid-glass-space--vertical' : ''
  const wrapClass = wrap ? ' liquid-glass-space--wrap' : ''

  const childArray = Array.isArray(children)
    ? children
    : children != null
      ? [children]
      : []

  return (
    <div
      className={`liquid-glass-space${dirClass}${wrapClass}${className ? ` ${className}` : ''}`}
      style={{ gap, alignItems: align, justifyContent: justify, ...style }}
      {...props}
    >
      {split
        ? childArray.flatMap((child, i) =>
            i === 0
              ? [child]
              : [
                  <span key={`split-${i}`} className="liquid-glass-space__split">
                    {split}
                  </span>,
                  child,
                ],
          )
        : children}
    </div>
  )
}

export default LiquidGlassSpace
