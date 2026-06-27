import { type InputHTMLAttributes, type ReactNode, useState } from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './CheckboxLiquidGlass.scss'

export type CheckboxLiquidGlassSize = 'sm' | 'md' | 'lg'

export interface CheckboxLiquidGlassProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  size?: CheckboxLiquidGlassSize
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: ReactNode
}

export function CheckboxLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
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
}: CheckboxLiquidGlassProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked)
  const isControlled = checkedProp !== undefined
  const checked = isControlled ? checkedProp : uncontrolled

  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLLabelElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.badge },
      baseClass: 'checkbox-liquid-glass',
      variant,
    })

  const sizeClass = size === 'md' ? '' : ` checkbox-liquid-glass--${size}`

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
      <label
        ref={hostRef}
        className={`checkbox-liquid-glass${sizeClass}${variantClass}${checked ? ' checkbox-liquid-glass--checked' : ''}${disabled ? ' checkbox-liquid-glass--disabled' : ''}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
      >
        <input
          type="checkbox"
          id={id}
          className="checkbox-liquid-glass__input"
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            onChange?.(e)
            if (!isControlled) setUncontrolled(e.target.checked)
            onCheckedChange?.(e.target.checked)
          }}
          {...props}
        />
        <span className="checkbox-liquid-glass__box" aria-hidden>
          {checked && <span className="checkbox-liquid-glass__mark">✓</span>}
        </span>
        {label && <span className="checkbox-liquid-glass__label">{label}</span>}
      </label>
    </>
  )
}

export default CheckboxLiquidGlass
