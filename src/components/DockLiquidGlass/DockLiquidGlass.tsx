import { type HTMLAttributes, type ReactNode } from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './DockLiquidGlass.scss'

export interface DockLiquidGlassItem {
  id: string
  label: string
  icon: ReactNode
  disabled?: boolean
  onClick?: () => void
}

export interface DockLiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  items: DockLiquidGlassItem[]
}

export function DockLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  items,
  className = '',
  style,
  ...props
}: DockLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.dock },
      baseClass: 'dock-liquid-glass',
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
        role="toolbar"
        aria-label="Dock"
        className={`dock-liquid-glass${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {items.map(({ id, label, icon, disabled, onClick }) => (
          <button
            key={id}
            type="button"
            className="dock-liquid-glass__item"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
          >
            <span className="dock-liquid-glass__icon">{icon}</span>
          </button>
        ))}
      </div>
    </>
  )
}

export default DockLiquidGlass
