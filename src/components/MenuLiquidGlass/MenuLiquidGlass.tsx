import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './MenuLiquidGlass.scss'

export interface MenuLiquidGlassItem {
  key: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
  danger?: boolean
  onClick?: () => void
}

export interface MenuLiquidGlassProps
  extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  items: MenuLiquidGlassItem[]
  selectedKeys?: string[]
  onSelect?: (key: string) => void
  mode?: 'vertical' | 'inline'
}

export function MenuLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  items,
  selectedKeys = [],
  onSelect,
  mode = 'vertical',
  className = '',
  style,
  ...props
}: MenuLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLUListElement>(glassParams, { baseClass: 'menu-liquid-glass', variant })

  const modeClass = mode === 'vertical' ? '' : ' menu-liquid-glass--inline'

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
      <ul
        ref={hostRef}
        role="menu"
        className={`menu-liquid-glass${variantClass}${modeClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {items.map((item) => {
          const selected = selectedKeys.includes(item.key)
          return (
            <li key={item.key} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={`menu-liquid-glass__item${selected ? ' menu-liquid-glass__item--selected' : ''}${item.danger ? ' menu-liquid-glass__item--danger' : ''}`}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.()
                    onSelect?.(item.key)
                  }
                }}
              >
                {item.icon && <span className="menu-liquid-glass__icon">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default MenuLiquidGlass
