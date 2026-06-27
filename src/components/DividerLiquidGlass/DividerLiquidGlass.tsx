import { type HTMLAttributes } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './DividerLiquidGlass.scss'

export interface DividerLiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  orientation?: 'horizontal' | 'vertical'
}

export function DividerLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  orientation = 'horizontal',
  className = '',
  style,
  ...props
}: DividerLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, { baseClass: 'divider-liquid-glass', variant })

  const orientClass =
    orientation === 'horizontal'
      ? ' divider-liquid-glass--horizontal'
      : ' divider-liquid-glass--vertical'

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
        role="separator"
        aria-orientation={orientation}
        className={`divider-liquid-glass${variantClass}${orientClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      />
    </>
  )
}

export default DividerLiquidGlass
