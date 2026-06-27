import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './StepsLiquidGlass.scss'

export interface LiquidGlassStepItem {
  title: ReactNode
  description?: ReactNode
  status?: 'wait' | 'process' | 'finish' | 'error'
}

export interface StepsLiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  items: LiquidGlassStepItem[]
  current?: number
  direction?: 'horizontal' | 'vertical'
}

export function StepsLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  items,
  current = 0,
  direction = 'horizontal',
  className = '',
  style,
  ...props
}: StepsLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, { baseClass: 'steps-liquid-glass', variant })

  const dirClass =
    direction === 'horizontal' ? '' : ' steps-liquid-glass--vertical'

  const getStatus = (index: number, item: LiquidGlassStepItem) => {
    if (item.status) return item.status
    if (index < current) return 'finish'
    if (index === current) return 'process'
    return 'wait'
  }

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
        className={`steps-liquid-glass${variantClass}${dirClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {items.map((item, index) => {
          const status = getStatus(index, item)
          return (
            <div
              key={index}
              className={`steps-liquid-glass__item steps-liquid-glass__item--${status}`}
            >
              <div className="steps-liquid-glass__icon">{index + 1}</div>
              <div className="steps-liquid-glass__content">
                <div className="steps-liquid-glass__title">{item.title}</div>
                {item.description && (
                  <div className="steps-liquid-glass__desc">{item.description}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default StepsLiquidGlass
