import { useState, type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassCollapse.scss'

export interface LiquidGlassCollapseItem {
  key: string
  label: ReactNode
  children: ReactNode
  disabled?: boolean
}

export interface LiquidGlassCollapseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  glassParams?: LiquidGlassParams
  items: LiquidGlassCollapseItem[]
  accordion?: boolean
  defaultActiveKeys?: string[]
  activeKeys?: string[]
  onChange?: (keys: string[]) => void
}

export function LiquidGlassCollapse({
  glassParams,
  items,
  accordion = false,
  defaultActiveKeys = [],
  activeKeys: activeKeysProp,
  onChange,
  className = '',
  style,
  ...props
}: LiquidGlassCollapseProps) {
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultActiveKeys)
  const isControlled = activeKeysProp !== undefined
  const activeKeys = isControlled ? activeKeysProp : uncontrolled

  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams)

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
      <LiquidGlassFilter
        filterId={filterId}
        mapId={mapId}
        mapUrl={mapUrl}
        width={filterSize.width}
        height={filterSize.height}
      />
      <div
        ref={hostRef}
        className={`liquid-glass-collapse${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {items.map((item) => {
          const open = activeKeys.includes(item.key)
          return (
            <div
              key={item.key}
              className={`liquid-glass-collapse__item${open ? ' liquid-glass-collapse__item--open' : ''}`}
            >
              <button
                type="button"
                className="liquid-glass-collapse__header"
                disabled={item.disabled}
                aria-expanded={open}
                onClick={() => !item.disabled && toggle(item.key)}
              >
                <span>{item.label}</span>
                <span className="liquid-glass-collapse__arrow" aria-hidden>
                  {open ? '▾' : '▸'}
                </span>
              </button>
              {open && <div className="liquid-glass-collapse__body">{item.children}</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default LiquidGlassCollapse
