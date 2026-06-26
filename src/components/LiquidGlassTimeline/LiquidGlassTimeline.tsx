import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassTimeline.scss'

export interface LiquidGlassTimelineItem {
  key: string
  label?: ReactNode
  children: ReactNode
  color?: 'default' | 'success' | 'warning' | 'error'
}

export interface LiquidGlassTimelineProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  items: LiquidGlassTimelineItem[]
  mode?: 'left' | 'alternate'
}

export function LiquidGlassTimeline({
  glassParams,
  items,
  mode = 'left',
  className = '',
  style,
  ...props
}: LiquidGlassTimelineProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams)

  const modeClass = mode === 'left' ? '' : ' liquid-glass-timeline--alternate'

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
        className={`liquid-glass-timeline${modeClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {items.map((item, index) => (
          <div
            key={item.key}
            className={`liquid-glass-timeline__item liquid-glass-timeline__item--${item.color ?? 'default'}${index === items.length - 1 ? ' liquid-glass-timeline__item--last' : ''}`}
          >
            <div className="liquid-glass-timeline__dot" aria-hidden />
            <div className="liquid-glass-timeline__content">
              {item.label && <div className="liquid-glass-timeline__label">{item.label}</div>}
              <div className="liquid-glass-timeline__body">{item.children}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default LiquidGlassTimeline
