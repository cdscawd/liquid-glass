import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassSteps.scss'

export interface LiquidGlassStepItem {
  title: ReactNode
  description?: ReactNode
  status?: 'wait' | 'process' | 'finish' | 'error'
}

export interface LiquidGlassStepsProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  items: LiquidGlassStepItem[]
  current?: number
  direction?: 'horizontal' | 'vertical'
}

export function LiquidGlassSteps({
  glassParams,
  items,
  current = 0,
  direction = 'horizontal',
  className = '',
  style,
  ...props
}: LiquidGlassStepsProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams)

  const dirClass =
    direction === 'horizontal' ? '' : ' liquid-glass-steps--vertical'

  const getStatus = (index: number, item: LiquidGlassStepItem) => {
    if (item.status) return item.status
    if (index < current) return 'finish'
    if (index === current) return 'process'
    return 'wait'
  }

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
        className={`liquid-glass-steps${dirClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {items.map((item, index) => {
          const status = getStatus(index, item)
          return (
            <div
              key={index}
              className={`liquid-glass-steps__item liquid-glass-steps__item--${status}`}
            >
              <div className="liquid-glass-steps__icon">{index + 1}</div>
              <div className="liquid-glass-steps__content">
                <div className="liquid-glass-steps__title">{item.title}</div>
                {item.description && (
                  <div className="liquid-glass-steps__desc">{item.description}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default LiquidGlassSteps
