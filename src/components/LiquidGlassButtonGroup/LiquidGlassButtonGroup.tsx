import {
  createContext,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassButtonGroup.scss'

export type LiquidGlassButtonGroupSize = 'sm' | 'md' | 'lg'

export interface LiquidGlassButtonGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  glassParams?: LiquidGlassParams
  size?: LiquidGlassButtonGroupSize
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  children: ReactNode
}

interface ButtonGroupContextValue {
  value: string | undefined
  name?: string
  size: LiquidGlassButtonGroupSize
  select: (value: string) => void
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null)

function useButtonGroupContext(component: string) {
  const ctx = useContext(ButtonGroupContext)
  if (!ctx) {
    throw new Error(`${component} must be used within LiquidGlassButtonGroup`)
  }
  return ctx
}

export interface LiquidGlassButtonGroupItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function LiquidGlassButtonGroupItem({
  value,
  className = '',
  disabled,
  children,
  ...props
}: LiquidGlassButtonGroupItemProps) {
  const { value: selectedValue, name, size, select } = useButtonGroupContext(
    'LiquidGlassButtonGroup.Item',
  )
  const selected = selectedValue === value
  const sizeClass =
    size === 'md' ? '' : ` liquid-glass-button-group__item--${size}`

  return (
    <button
      type="button"
      role="radio"
      name={name}
      value={value}
      aria-checked={selected}
      disabled={disabled}
      className={`liquid-glass-button-group__item${selected ? ' liquid-glass-button-group__item--selected' : ''}${sizeClass}${className ? ` ${className}` : ''}`}
      onClick={() => {
        if (!disabled) select(value)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export function LiquidGlassButtonGroup({
  glassParams,
  size = 'md',
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  className = '',
  style,
  children,
  ...props
}: LiquidGlassButtonGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  const select = (next: string) => {
    if (!isControlled) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, [children, value])

  const sizeClass = size === 'md' ? '' : ` liquid-glass-button-group--${size}`

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
        className={`liquid-glass-button-group${sizeClass}${className ? ` ${className}` : ''}`}
        style={{
          ...filterStyle,
          borderRadius,
          ...style,
        }}
        {...props}
      >
        <ButtonGroupContext.Provider value={{ value, name, size, select }}>
          {children}
        </ButtonGroupContext.Provider>
      </div>
    </>
  )
}

LiquidGlassButtonGroup.Item = LiquidGlassButtonGroupItem

export default LiquidGlassButtonGroup
