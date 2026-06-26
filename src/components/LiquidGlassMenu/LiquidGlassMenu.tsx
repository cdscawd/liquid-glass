import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassMenu.scss'

export interface LiquidGlassMenuItem {
  key: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
  danger?: boolean
  onClick?: () => void
}

export interface LiquidGlassMenuProps
  extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  glassParams?: LiquidGlassParams
  items: LiquidGlassMenuItem[]
  selectedKeys?: string[]
  onSelect?: (key: string) => void
  mode?: 'vertical' | 'inline'
}

export function LiquidGlassMenu({
  glassParams,
  items,
  selectedKeys = [],
  onSelect,
  mode = 'vertical',
  className = '',
  style,
  ...props
}: LiquidGlassMenuProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLUListElement>(glassParams)

  const modeClass = mode === 'vertical' ? '' : ' liquid-glass-menu--inline'

  return (
    <>
      <LiquidGlassFilter
        filterId={filterId}
        mapId={mapId}
        mapUrl={mapUrl}
        width={filterSize.width}
        height={filterSize.height}
      />
      <ul
        ref={hostRef}
        role="menu"
        className={`liquid-glass-menu${modeClass}${className ? ` ${className}` : ''}`}
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
                className={`liquid-glass-menu__item${selected ? ' liquid-glass-menu__item--selected' : ''}${item.danger ? ' liquid-glass-menu__item--danger' : ''}`}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.()
                    onSelect?.(item.key)
                  }
                }}
              >
                {item.icon && <span className="liquid-glass-menu__icon">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default LiquidGlassMenu
