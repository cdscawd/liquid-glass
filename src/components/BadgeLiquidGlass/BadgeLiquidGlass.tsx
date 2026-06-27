import { type HTMLAttributes } from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './BadgeLiquidGlass.scss'

export type BadgeLiquidGlassSize = 'sm' | 'md' | 'lg'
/** @deprecated 使用 shape */
export type BadgeLiquidGlassVariant = 'badge' | 'chip'
export type BadgeLiquidGlassShape = 'badge' | 'chip'

export interface BadgeLiquidGlassProps extends HTMLAttributes<HTMLSpanElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  size?: BadgeLiquidGlassSize
  /** 外形：badge 圆角矩形 / chip 胶囊 */
  shape?: BadgeLiquidGlassShape
  /** @deprecated 使用 shape */
  variant?: BadgeLiquidGlassShape
  /** 语义色：default | primary | danger | success */
  tone?: LiquidGlassVariant
}

export function BadgeLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  size = 'md',
  shape: shapeProp,
  variant: legacyShape,
  tone,
  className = '',
  style,
  children,
  ...props
}: BadgeLiquidGlassProps) {
  const shape = shapeProp ?? legacyShape ?? 'badge'

  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLSpanElement>(glassParams, {
      preset: {
        borderRadius: shape === 'chip' ? GLASS_SHAPE.pill : GLASS_SHAPE.badge,
      },
      baseClass: 'badge-liquid-glass',
      variant: tone,
    })

  const sizeClass = size === 'md' ? '' : ` badge-liquid-glass--${size}`
  const shapeClass = shape === 'badge' ? '' : ` badge-liquid-glass--${shape}`

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
        className={`badge-liquid-glass${shapeClass}${sizeClass}${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        <HostBoundary>{children}</HostBoundary>
      </span>
    </>
  )
}

export default BadgeLiquidGlass
