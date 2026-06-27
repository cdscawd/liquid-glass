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
import './SpinLiquidGlass.scss'

export interface SpinLiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  spinning?: boolean
  tip?: string
  size?: 'sm' | 'md' | 'lg'
}

export function SpinLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  spinning = true,
  tip,
  size = 'md',
  className = '',
  style,
  children,
  ...props
}: SpinLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.pill },
      baseClass: 'spin-liquid-glass',
      variant,
    })

  const sizeClass = size === 'md' ? '' : ` spin-liquid-glass--${size}`

  if (!spinning && !children) return null

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
      <div
        className={`spin-wrap-liquid-glass${className ? ` ${className}` : ''}`}
        style={style}
      >
        <HostBoundary>{children}</HostBoundary>
        {spinning && (
          <div
            ref={hostRef}
            className={`spin-liquid-glass${sizeClass}${variantClass}${children ? ' spin-liquid-glass--overlay' : ''}`}
            style={{ ...filterStyle, borderRadius }}
            role="status"
            aria-live="polite"
            {...props}
          >
            <span className="spin-liquid-glass__indicator" aria-hidden />
            {tip && <span className="spin-liquid-glass__tip">{tip}</span>}
          </div>
        )}
      </div>
    </>
  )
}

export default SpinLiquidGlass
