import { useState, type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './CollapseLiquidGlass.scss'

export interface CollapseLiquidGlassItem {
  key: string
  label: ReactNode
  children: ReactNode
  disabled?: boolean
}

export interface CollapseLiquidGlassProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  items: CollapseLiquidGlassItem[]
  accordion?: boolean
  defaultActiveKeys?: string[]
  activeKeys?: string[]
  onChange?: (keys: string[]) => void
}

export function CollapseLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  items,
  accordion = false,
  defaultActiveKeys = [],
  activeKeys: activeKeysProp,
  onChange,
  className = '',
  style,
  ...props
}: CollapseLiquidGlassProps) {
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultActiveKeys)
  const isControlled = activeKeysProp !== undefined
  const activeKeys = isControlled ? activeKeysProp : uncontrolled

  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, { baseClass: 'collapse-liquid-glass', variant })

  const toggle = (key: string) => {
    const isActive = activeKeys.includes(key)
    let next: string[]
    if (accordion) {
      next = isActive ? [] : [key]
    } else {
      next = isActive ? activeKeys.filter((k) => k !== key) : [...activeKeys, key]
    }
    if (!isControlled) setUncontrolled(next)
    onChange?.(next)
  }

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
        className={`collapse-liquid-glass${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {items.map((item) => {
          const open = activeKeys.includes(item.key)
          return (
            <div
              key={item.key}
              className={`collapse-liquid-glass__item${open ? ' collapse-liquid-glass__item--open' : ''}`}
            >
              <button
                type="button"
                className="collapse-liquid-glass__header"
                disabled={item.disabled}
                aria-expanded={open}
                onClick={() => !item.disabled && toggle(item.key)}
              >
                <span>{item.label}</span>
                <span className="collapse-liquid-glass__arrow" aria-hidden>
                  {open ? '▾' : '▸'}
                </span>
              </button>
              {open && <div className="collapse-liquid-glass__body">{item.children}</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default CollapseLiquidGlass
