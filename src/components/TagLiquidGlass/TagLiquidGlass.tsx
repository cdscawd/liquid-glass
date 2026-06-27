import { type HTMLAttributes, type ReactNode } from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './TagLiquidGlass.scss'

export type TagLiquidGlassSize = 'sm' | 'md' | 'lg'
export type TagLiquidGlassColor = 'default' | 'success' | 'warning' | 'error' | 'info'

export interface TagLiquidGlassProps extends HTMLAttributes<HTMLSpanElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  size?: TagLiquidGlassSize
  /** 语义色，优先于 color */
  variant?: LiquidGlassVariant
  color?: TagLiquidGlassColor
  closable?: boolean
  onClose?: () => void
  icon?: ReactNode
}

function resolveTagVariant(
  variant?: LiquidGlassVariant,
  color?: TagLiquidGlassColor,
): LiquidGlassVariant {
  if (variant) return variant
  if (color === 'info') return 'primary'
  if (color === 'error') return 'danger'
  if (color === 'success') return 'success'
  return 'default'
}

export function TagLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  size = 'md',
  variant,
  color = 'default',
  closable = false,
  onClose,
  icon,
  className = '',
  style,
  children,
  ...props
}: TagLiquidGlassProps) {
  const tone = resolveTagVariant(variant, color)
  const legacyColorClass =
    !variant && color !== 'default' && color !== 'info' && color !== 'error' && color !== 'success'
      ? ` tag-liquid-glass--${color}`
      : ''

  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLSpanElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.pill },
      baseClass: 'tag-liquid-glass',
      variant: tone,
    })

  const sizeClass = size === 'md' ? '' : ` tag-liquid-glass--${size}`

  return (
    <>
      {isFilterActive && (
        <LiquidGlassFilter
        filterId={filterId}
        mapId={mapId}
        mapUrl={mapUrl}
        width={filterSize.width}
        height={filterSize.height}
      />
      )}
      <span
        ref={hostRef}
        className={`tag-liquid-glass${legacyColorClass}${sizeClass}${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {icon && <span className="tag-liquid-glass__icon">{icon}</span>}
        <span className="tag-liquid-glass__text"><HostBoundary>{children}</HostBoundary></span>
        {closable && (
          <button
            type="button"
            className="tag-liquid-glass__close"
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

export default TagLiquidGlass
