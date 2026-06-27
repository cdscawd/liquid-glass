import { type HTMLAttributes } from 'react'
import {
  DEFAULT_FILL_STRENGTH_MULTIPLIER,
  DEFAULT_THUMB_STRENGTH,
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './ProgressLiquidGlass.scss'

export interface ProgressLiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  fillGlassParams?: LiquidGlassParams
  value?: number
  max?: number
}

export function ProgressLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  fillGlassParams,
  value = 0,
  max = 100,
  className = '',
  style,
  ...props
}: ProgressLiquidGlassProps) {
  const percent = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0

  const {
    hostRef,
    filterId,
    mapId,
    mapUrl,
    filterSize,
    filterStyle,
    borderRadius,
    isFilterActive,
    HostBoundary,
  } = useLiquidGlassEffect<HTMLDivElement>(glassParams, {
    preset: { borderRadius: GLASS_SHAPE.pill },
    filterMode,
    nestedPolicy,
  })

  const {
    hostRef: fillRef,
    filterId: fillFilterId,
    mapId: fillMapId,
    mapUrl: fillMapUrl,
    filterSize: fillFilterSize,
    filterStyle: fillFilterStyle,
    isFilterActive: isFillFilterActive,
  } = useLiquidGlassEffect<HTMLDivElement>(fillGlassParams, {
    preset: {
      borderRadius: GLASS_SHAPE.pill,
      strength: DEFAULT_THUMB_STRENGTH * DEFAULT_FILL_STRENGTH_MULTIPLIER,
    },
    filterMode,
    nestedPolicy,
  })

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
      {isFillFilterActive && (
        <LiquidGlassFilter
          filterId={fillFilterId}
          mapId={fillMapId}
          mapUrl={fillMapUrl}
          width={fillFilterSize.width}
          height={fillFilterSize.height}
        />
      )}
      <div
        ref={hostRef}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={`progress-liquid-glass${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        <HostBoundary>
          <div
            ref={fillRef}
            className="progress-liquid-glass__fill"
            style={{
              ...fillFilterStyle,
              width: `${percent}%`,
              borderRadius,
            }}
          />
        </HostBoundary>
      </div>
    </>
  )
}

export default ProgressLiquidGlass
