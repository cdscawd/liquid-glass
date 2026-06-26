import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassFloatButton.scss'

export type LiquidGlassFloatButtonShape = 'circle' | 'square'

export interface LiquidGlassFloatButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  glassParams?: LiquidGlassParams
  icon?: ReactNode
  description?: ReactNode
  shape?: LiquidGlassFloatButtonShape
}

export function LiquidGlassFloatButton({
  glassParams,
  icon,
  description,
  shape = 'circle',
  className = '',
  style,
  children,
  ...props
}: LiquidGlassFloatButtonProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLButtonElement>(glassParams, {
      preset: { borderRadius: shape === 'circle' ? GLASS_SHAPE.pill : GLASS_SHAPE.default },
    })

  const shapeClass = shape === 'circle' ? '' : ' liquid-glass-float-button--square'

  return (
    <>
      <LiquidGlassFilter
        filterId={filterId}
        mapId={mapId}
        mapUrl={mapUrl}
        width={filterSize.width}
        height={filterSize.height}
      />
      <button
        ref={hostRef}
        type="button"
        className={`liquid-glass-float-button${shapeClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        aria-label={typeof description === 'string' ? description : undefined}
        {...props}
      >
        <span className="liquid-glass-float-button__icon">{icon ?? children}</span>
        {description && (
          <span className="liquid-glass-float-button__desc">{description}</span>
        )}
      </button>
    </>
  )
}

export default LiquidGlassFloatButton
