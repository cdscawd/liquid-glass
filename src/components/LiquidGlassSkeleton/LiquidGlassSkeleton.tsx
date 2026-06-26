import { type HTMLAttributes } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassSkeleton.scss'

export interface LiquidGlassSkeletonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  glassParams?: LiquidGlassParams
  active?: boolean
  avatar?: boolean
  paragraph?: boolean | { rows?: number }
  title?: boolean
}

export function LiquidGlassSkeleton({
  glassParams,
  active = true,
  avatar = false,
  paragraph = true,
  title = true,
  className = '',
  style,
  ...props
}: LiquidGlassSkeletonProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams)

  const rows =
    typeof paragraph === 'object' ? (paragraph.rows ?? 3) : paragraph ? 3 : 0

  return (
    <>
      <LiquidGlassFilter
        filterId={filterId}
        mapId={mapId}
        mapUrl={mapUrl}
        width={filterSize.width}
        height={filterSize.height}
      />
      <div
        ref={hostRef}
        className={`liquid-glass-skeleton${active ? ' liquid-glass-skeleton--active' : ''}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        aria-hidden
        {...props}
      >
        {avatar && <div className="liquid-glass-skeleton__avatar" />}
        <div className="liquid-glass-skeleton__content">
          {title && <div className="liquid-glass-skeleton__title" />}
          {rows > 0 &&
            Array.from({ length: rows }, (_, i) => (
              <div
                key={i}
                className="liquid-glass-skeleton__line"
                style={{ width: i === rows - 1 ? '60%' : '100%' }}
              />
            ))}
        </div>
      </div>
    </>
  )
}

export default LiquidGlassSkeleton
