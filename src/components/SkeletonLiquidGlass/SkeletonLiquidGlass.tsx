import { type HTMLAttributes } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './SkeletonLiquidGlass.scss'

export interface SkeletonLiquidGlassProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  active?: boolean
  avatar?: boolean
  paragraph?: boolean | { rows?: number }
  title?: boolean
}

export function SkeletonLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  active = true,
  avatar = false,
  paragraph = true,
  title = true,
  className = '',
  style,
  ...props
}: SkeletonLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, { baseClass: 'skeleton-liquid-glass', variant })

  const rows =
    typeof paragraph === 'object' ? (paragraph.rows ?? 3) : paragraph ? 3 : 0

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
        ref={hostRef}
        className={`skeleton-liquid-glass${variantClass}${active ? ' skeleton-liquid-glass--active' : ''}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        aria-hidden
        {...props}
      >
        {avatar && <div className="skeleton-liquid-glass__avatar" />}
        <div className="skeleton-liquid-glass__content">
          {title && <div className="skeleton-liquid-glass__title" />}
          {rows > 0 &&
            Array.from({ length: rows }, (_, i) => (
              <div
                key={i}
                className="skeleton-liquid-glass__line"
                style={{ width: i === rows - 1 ? '60%' : '100%' }}
              />
            ))}
        </div>
      </div>
    </>
  )
}

export default SkeletonLiquidGlass
