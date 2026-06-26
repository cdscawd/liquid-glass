import { type HTMLAttributes } from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassSpin.scss'

export interface LiquidGlassSpinProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  spinning?: boolean
  tip?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LiquidGlassSpin({
  glassParams,
  spinning = true,
  tip,
  size = 'md',
  className = '',
  style,
  children,
  ...props
}: LiquidGlassSpinProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.pill },
    })

  const sizeClass = size === 'md' ? '' : ` liquid-glass-spin--${size}`

  if (!spinning && !children) return null

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
        className={`liquid-glass-spin-wrap${className ? ` ${className}` : ''}`}
        style={style}
      >
        {children}
        {spinning && (
          <div
            ref={hostRef}
            className={`liquid-glass-spin${sizeClass}${children ? ' liquid-glass-spin--overlay' : ''}`}
            style={{ ...filterStyle, borderRadius }}
            role="status"
            aria-live="polite"
            {...props}
          >
            <span className="liquid-glass-spin__indicator" aria-hidden />
            {tip && <span className="liquid-glass-spin__tip">{tip}</span>}
          </div>
        )}
      </div>
    </>
  )
}

export default LiquidGlassSpin
