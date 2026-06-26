import {
  createContext,
  useCallback,
  useContext,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassRadio.scss'

export type LiquidGlassRadioSize = 'sm' | 'md' | 'lg'

interface RadioGroupContextValue {
  value: string | undefined
  name?: string
  size: LiquidGlassRadioSize
  select: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

function useRadioGroup(name: string) {
  const ctx = useContext(RadioGroupContext)
  if (!ctx) throw new Error(`${name} must be used within LiquidGlassRadioGroup`)
  return ctx
}

export interface LiquidGlassRadioGroupProps {
  glassParams?: LiquidGlassParams
  size?: LiquidGlassRadioSize
  name?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  style?: React.CSSProperties
  children: ReactNode
}

export function LiquidGlassRadioGroup({
  glassParams,
  size = 'md',
  name,
  value: valueProp,
  defaultValue,
  onValueChange,
  className = '',
  style,
  children,
}: LiquidGlassRadioGroupProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolled

  const select = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.pill },
    })

  const sizeClass = size === 'md' ? '' : ` liquid-glass-radio-group--${size}`

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
        role="radiogroup"
        aria-label={name}
        className={`liquid-glass-radio-group${sizeClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
      >
        <RadioGroupContext.Provider value={{ value, name, size, select }}>
          {children}
        </RadioGroupContext.Provider>
      </div>
    </>
  )
}

export interface LiquidGlassRadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  value: string
  label?: ReactNode
}

export function LiquidGlassRadio({
  value,
  label,
  className = '',
  disabled,
  onChange,
  ...props
}: LiquidGlassRadioProps) {
  const { value: selected, name, size, select } = useRadioGroup('LiquidGlassRadio')
  const checked = selected === value
  const sizeClass = size === 'md' ? '' : ` liquid-glass-radio--${size}`

  return (
    <label
      className={`liquid-glass-radio${sizeClass}${checked ? ' liquid-glass-radio--checked' : ''}${disabled ? ' liquid-glass-radio--disabled' : ''}${className ? ` ${className}` : ''}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        className="liquid-glass-radio__input"
        onChange={(e) => {
          onChange?.(e)
          select(value)
        }}
        {...props}
      />
      <span className="liquid-glass-radio__dot" aria-hidden />
      {label && <span className="liquid-glass-radio__label">{label}</span>}
    </label>
  )
}

LiquidGlassRadioGroup.Radio = LiquidGlassRadio

export default LiquidGlassRadioGroup
