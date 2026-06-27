import { type InputHTMLAttributes } from 'react'
import {
  LiquidGlassFilter,
  GLASS_SHAPE,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './SliderLiquidGlass.scss'

export interface SliderLiquidGlassProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
}

export function SliderLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  className = '',
  style,
  min = 0,
  max = 100,
  value,
  defaultValue,
  ...props
}: SliderLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.pill },
      baseClass: 'slider-liquid-glass',
      variant,
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
      <div
        ref={hostRef}
        className={`slider-liquid-glass${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
      >
        <input
          type="range"
          className="slider-liquid-glass__input"
          min={min}
          max={max}
          value={value}
          defaultValue={defaultValue}
          {...props}
        />
      </div>
    </>
  )
}

export default SliderLiquidGlass
