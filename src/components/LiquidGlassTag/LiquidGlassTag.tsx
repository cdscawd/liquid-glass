import { type HTMLAttributes, type ReactNode } from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassTag.scss'

export type LiquidGlassTagSize = 'sm' | 'md' | 'lg'
export type LiquidGlassTagColor = 'default' | 'success' | 'warning' | 'error' | 'info'

export interface LiquidGlassTagProps extends HTMLAttributes<HTMLSpanElement> {
  glassParams?: LiquidGlassParams
  size?: LiquidGlassTagSize
  color?: LiquidGlassTagColor
  closable?: boolean
  onClose?: () => void
  icon?: ReactNode
}

export function LiquidGlassTag({
  glassParams,
  size = 'md',
  color = 'default',
  closable = false,
  onClose,
  icon,
  className = '',
  style,
  children,
  ...props
}: LiquidGlassTagProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLSpanElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.pill },
    })

  const sizeClass = size === 'md' ? '' : ` liquid-glass-tag--${size}`
  const colorClass = color === 'default' ? '' : ` liquid-glass-tag--${color}`

  return (
    <>
      <LiquidGlassFilter
        filterId={filterId}
        mapId={mapId}
        mapUrl={mapUrl}
        width={filterSize.width}
        height={filterSize.height}
      />
      <span
        ref={hostRef}
        className={`liquid-glass-tag${colorClass}${sizeClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {icon && <span className="liquid-glass-tag__icon">{icon}</span>}
        <span className="liquid-glass-tag__text">{children}</span>
        {closable && (
          <button
            type="button"
            className="liquid-glass-tag__close"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation()
              onClose?.()
            }}
          >
            ×
          </button>
        )}
      </span>
    </>
  )
}

export default LiquidGlassTag
