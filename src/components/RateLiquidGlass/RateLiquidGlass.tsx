import { useState } from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './RateLiquidGlass.scss'

export interface RateLiquidGlassProps {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  count?: number
  value?: number
  defaultValue?: number
  allowHalf?: boolean
  disabled?: boolean
  onChange?: (value: number) => void
  className?: string
  style?: React.CSSProperties
}

export function RateLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  count = 5,
  value: valueProp,
  defaultValue = 0,
  allowHalf = false,
  disabled = false,
  onChange,
  className = '',
  style,
}: RateLiquidGlassProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolled
  const [hover, setHover] = useState<number | null>(null)

  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.pill },
      baseClass: 'rate-liquid-glass',
      variant,
      filterMode,
      nestedPolicy,
    })

  const display = hover ?? value

  const setValue = (next: number) => {
    if (disabled) return
    if (!isControlled) setUncontrolled(next)
    onChange?.(next)
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
        role="slider"
        aria-valuemin={0}
        aria-valuemax={count}
        aria-valuenow={value}
        className={`rate-liquid-glass${variantClass}${disabled ? ' rate-liquid-glass--disabled' : ''}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
      >
        {Array.from({ length: count }, (_, i) => {
          const index = i + 1
          const active = display >= index
          const half = allowHalf && display >= index - 0.5 && display < index
          return (
            <button
              key={index}
              type="button"
              className={`rate-liquid-glass__star${active ? ' rate-liquid-glass__star--active' : ''}${half ? ' rate-liquid-glass__star--half' : ''}`}
              disabled={disabled}
              aria-label={`${index} stars`}
              onMouseEnter={() => !disabled && setHover(index)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setValue(index)}
            >
              ★
            </button>
          )
        })}
      </div>
    </>
  )
}

export default RateLiquidGlass
