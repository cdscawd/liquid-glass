import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassStatistic.scss'

export interface LiquidGlassStatisticProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'prefix'> {
  glassParams?: LiquidGlassParams
  title?: ReactNode
  value?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
}

export function LiquidGlassStatistic({
  glassParams,
  title,
  value,
  prefix,
  suffix,
  className = '',
  style,
  ...props
}: LiquidGlassStatisticProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams)

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
        className={`liquid-glass-statistic${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {title && <div className="liquid-glass-statistic__title">{title}</div>}
        <div className="liquid-glass-statistic__value">
          {prefix && <span className="liquid-glass-statistic__prefix">{prefix}</span>}
          <span className="liquid-glass-statistic__number">{value}</span>
          {suffix && <span className="liquid-glass-statistic__suffix">{suffix}</span>}
        </div>
      </div>
    </>
  )
}

export default LiquidGlassStatistic
