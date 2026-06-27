import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './TimelineLiquidGlass.scss'

export interface TimelineLiquidGlassItem {
  key: string
  label?: ReactNode
  children: ReactNode
  color?: 'default' | 'success' | 'warning' | 'error'
}

export interface TimelineLiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  items: TimelineLiquidGlassItem[]
  mode?: 'left' | 'alternate'
}

export function TimelineLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  items,
  mode = 'left',
  className = '',
  style,
  ...props
}: TimelineLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, { baseClass: 'timeline-liquid-glass', variant })

  const modeClass = mode === 'left' ? '' : ' timeline-liquid-glass--alternate'

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
        className={`timeline-liquid-glass${variantClass}${modeClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {items.map((item, index) => (
          <div
            key={item.key}
            className={`timeline-liquid-glass__item timeline-liquid-glass__item--${item.color ?? 'default'}${index === items.length - 1 ? ' timeline-liquid-glass__item--last' : ''}`}
          >
            <div className="timeline-liquid-glass__dot" aria-hidden />
            <div className="timeline-liquid-glass__content">
              {item.label && <div className="timeline-liquid-glass__label">{item.label}</div>}
              <div className="timeline-liquid-glass__body">{item.children}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default TimelineLiquidGlass
