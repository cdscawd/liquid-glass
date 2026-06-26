import { type InputHTMLAttributes, type ReactNode, useState } from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassCheckbox.scss'

export type LiquidGlassCheckboxSize = 'sm' | 'md' | 'lg'

export interface LiquidGlassCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  glassParams?: LiquidGlassParams
  size?: LiquidGlassCheckboxSize
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: ReactNode
}

export function LiquidGlassCheckbox({
  glassParams,
  size = 'md',
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  label,
  className = '',
  style,
  disabled,
  id,
  onChange,
  ...props
}: LiquidGlassCheckboxProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked)
  const isControlled = checkedProp !== undefined
  const checked = isControlled ? checkedProp : uncontrolled

  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLLabelElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.badge },
    })

  const sizeClass = size === 'md' ? '' : ` liquid-glass-checkbox--${size}`

  return (
    <>
      <LiquidGlassFilter
        filterId={filterId}
        mapId={mapId}
        mapUrl={mapUrl}
        width={filterSize.width}
        height={filterSize.height}
      />
      <label
        ref={hostRef}
        className={`liquid-glass-checkbox${sizeClass}${checked ? ' liquid-glass-checkbox--checked' : ''}${disabled ? ' liquid-glass-checkbox--disabled' : ''}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
      >
        <input
          type="checkbox"
          id={id}
          className="liquid-glass-checkbox__input"
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            onChange?.(e)
            if (!isControlled) setUncontrolled(e.target.checked)
            onCheckedChange?.(e.target.checked)
          }}
          {...props}
        />
        <span className="liquid-glass-checkbox__box" aria-hidden>
          {checked && <span className="liquid-glass-checkbox__mark">✓</span>}
        </span>
        {label && <span className="liquid-glass-checkbox__label">{label}</span>}
      </label>
    </>
  )
}

export default LiquidGlassCheckbox
