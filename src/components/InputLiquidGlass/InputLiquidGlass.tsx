import { type InputHTMLAttributes } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './InputLiquidGlass.scss'

export type InputLiquidGlassSize = 'sm' | 'md' | 'lg'

export interface InputLiquidGlassProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  size?: InputLiquidGlassSize
}

export function InputLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  size = 'md',
  className = '',
  style,
  ...props
}: InputLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, { baseClass: 'input-liquid-glass', variant, filterMode, nestedPolicy })

  const sizeClass = size === 'md' ? '' : ` input-liquid-glass--${size}`

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
        className={`input-liquid-glass${sizeClass}${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
      >
        <HostBoundary>
          <input className="input-liquid-glass__field" {...props} />
        </HostBoundary>
      </div>
    </>
  )
}

export default InputLiquidGlass
