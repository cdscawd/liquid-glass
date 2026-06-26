import { type ReactNode, type SelectHTMLAttributes } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassSelect.scss'

export type LiquidGlassSelectSize = 'sm' | 'md' | 'lg'

export interface LiquidGlassSelectOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface LiquidGlassSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  glassParams?: LiquidGlassParams
  size?: LiquidGlassSelectSize
  options?: LiquidGlassSelectOption[]
}

export function LiquidGlassSelect({
  glassParams,
  size = 'md',
  options,
  className = '',
  style,
  children,
  ...props
}: LiquidGlassSelectProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams)

  const sizeClass = size === 'md' ? '' : ` liquid-glass-select--${size}`

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
        className={`liquid-glass-select${sizeClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
      >
        <select className="liquid-glass-select__field" {...props}>
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
      </div>
    </>
  )
}

export default LiquidGlassSelect
