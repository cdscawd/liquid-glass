import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './StatisticLiquidGlass.scss'

export interface StatisticLiquidGlassProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'prefix'> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  title?: ReactNode
  value?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
}

export function StatisticLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  title,
  value,
  prefix,
  suffix,
  className = '',
  style,
  ...props
}: StatisticLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, { baseClass: 'statistic-liquid-glass', variant })

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
        className={`statistic-liquid-glass${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {title && <div className="statistic-liquid-glass__title">{title}</div>}
        <div className="statistic-liquid-glass__value">
          {prefix && <span className="statistic-liquid-glass__prefix">{prefix}</span>}
          <span className="statistic-liquid-glass__number">{value}</span>
          {suffix && <span className="statistic-liquid-glass__suffix">{suffix}</span>}
        </div>
      </div>
    </>
  )
}

export default StatisticLiquidGlass
