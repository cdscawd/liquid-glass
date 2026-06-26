import {
  type ButtonHTMLAttributes,
} from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassButton.scss'

export type LiquidGlassButtonSize = 'sm' | 'md' | 'lg'

export interface LiquidGlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  glassParams?: LiquidGlassParams
  size?: LiquidGlassButtonSize
}

export function LiquidGlassButton({
  glassParams,
  size = 'md',
  className = '',
  style,
  children,
  ...props
}: LiquidGlassButtonProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLButtonElement>(glassParams)

  const sizeClass = size === 'md' ? '' : ` liquid-glass-button--${size}`

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
        className={`liquid-glass-button${sizeClass}${className ? ` ${className}` : ''}`}
        style={{
          ...filterStyle,
          borderRadius,
          ...style,
        }}
        {...props}
      >
        {children}
      </button>
    </>
  )
}

export default LiquidGlassButton
