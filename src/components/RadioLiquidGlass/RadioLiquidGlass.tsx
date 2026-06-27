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
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './RadioLiquidGlass.scss'

export type RadioLiquidGlassSize = 'sm' | 'md' | 'lg'

interface RadioGroupContextValue {
  value: string | undefined
  name?: string
  size: RadioLiquidGlassSize
  select: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

function useRadioGroup(name: string) {
  const ctx = useContext(RadioGroupContext)
  if (!ctx) throw new Error(`${name} must be used within RadioLiquidGlassGroup`)
  return ctx
}

export interface RadioLiquidGlassGroupProps {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  size?: RadioLiquidGlassSize
  name?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  style?: React.CSSProperties
  children: ReactNode
}

export function RadioLiquidGlassGroup({
  glassParams,
  filterMode,
  nestedPolicy,
  size = 'md',
  name,
  value: valueProp,
  defaultValue,
  onValueChange,
  className = '',
  style,
  children,
}: RadioLiquidGlassGroupProps) {
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

  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.pill },
      filterMode,
      nestedPolicy,
    })

  const sizeClass = size === 'md' ? '' : ` radio-group-liquid-glass--${size}`

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
        role="radiogroup"
        aria-label={name}
        className={`radio-group-liquid-glass${sizeClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
      >
        <RadioGroupContext.Provider value={{ value, name, size, select }}>
          <HostBoundary>{children}</HostBoundary>
        </RadioGroupContext.Provider>
      </div>
    </>
  )
}

export interface RadioLiquidGlassProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  value: string
  label?: ReactNode
}

export function RadioLiquidGlass({
  value,
  label,
  className = '',
  disabled,
  onChange,
  ...props
}: RadioLiquidGlassProps) {
  const { value: selected, name, size, select } = useRadioGroup('RadioLiquidGlass')
  const checked = selected === value
  const sizeClass = size === 'md' ? '' : ` radio-liquid-glass--${size}`

  return (
    <label
      className={`radio-liquid-glass${sizeClass}${checked ? ' radio-liquid-glass--checked' : ''}${disabled ? ' radio-liquid-glass--disabled' : ''}${className ? ` ${className}` : ''}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        className="radio-liquid-glass__input"
        onChange={(e) => {
          onChange?.(e)
          select(value)
        }}
        {...props}
      />
      <span className="radio-liquid-glass__dot" aria-hidden />
      {label && <span className="radio-liquid-glass__label">{label}</span>}
    </label>
  )
}

RadioLiquidGlassGroup.Radio = RadioLiquidGlass

export default RadioLiquidGlassGroup
