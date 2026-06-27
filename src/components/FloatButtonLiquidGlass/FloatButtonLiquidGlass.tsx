import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './FloatButtonLiquidGlass.scss'

export type FloatButtonLiquidGlassShape = 'circle' | 'square'

export interface FloatButtonLiquidGlassProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  icon?: ReactNode
  description?: ReactNode
  shape?: FloatButtonLiquidGlassShape
}

export function FloatButtonLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  icon,
  description,
  shape = 'circle',
  className = '',
  style,
  children,
  ...props
}: FloatButtonLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLButtonElement>(glassParams, {
      preset: { borderRadius: shape === 'circle' ? GLASS_SHAPE.pill : GLASS_SHAPE.default },
      baseClass: 'float-button-liquid-glass',
      variant,
    })

  const shapeClass = shape === 'circle' ? '' : ' float-button-liquid-glass--square'

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
      <button
        ref={hostRef}
        type="button"
        className={`float-button-liquid-glass${variantClass}${shapeClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        aria-label={typeof description === 'string' ? description : undefined}
        {...props}
      >
        <span className="float-button-liquid-glass__icon">{icon ?? children}</span>
        {description && (
          <span className="float-button-liquid-glass__desc">{description}</span>
        )}
      </button>
    </>
  )
}

export default FloatButtonLiquidGlass
