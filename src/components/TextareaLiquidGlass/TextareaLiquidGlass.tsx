import { type TextareaHTMLAttributes } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './TextareaLiquidGlass.scss'

export type TextareaLiquidGlassSize = 'sm' | 'md' | 'lg'

export interface TextareaLiquidGlassProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  size?: TextareaLiquidGlassSize
}

export function TextareaLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  size = 'md',
  className = '',
  style,
  rows = 3,
  ...props
}: TextareaLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, { baseClass: 'textarea-liquid-glass', variant })

  const sizeClass = size === 'md' ? '' : ` textarea-liquid-glass--${size}`

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
        className={`textarea-liquid-glass${sizeClass}${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
      >
        <textarea className="textarea-liquid-glass__field" rows={rows} {...props} />
      </div>
    </>
  )
}

export default TextareaLiquidGlass
