import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import { useFloatingPosition } from '../../lib/useFloatingPosition'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './SelectLiquidGlass.scss'

export type SelectLiquidGlassSize = 'sm' | 'md' | 'lg'

export interface SelectLiquidGlassOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectLiquidGlassProps {
  glassParams?: LiquidGlassParams
  dropdownGlassParams?: LiquidGlassParams
  variant?: LiquidGlassVariant
  size?: SelectLiquidGlassSize
  options: SelectLiquidGlassOption[]
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  style?: CSSProperties
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
}

export function SelectLiquidGlass({
  glassParams,
  dropdownGlassParams,
  variant,
  size = 'md',
  options,
  value: valueProp,
  defaultValue,
  placeholder = 'Select…',
  disabled,
  className = '',
  style,
  onChange,
}: SelectLiquidGlassProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '')
  const [open, setOpen] = useState(false)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLUListElement>(null)

  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      baseClass: 'select-liquid-glass',
      variant,
    })

  const {
    hostRef: dropdownHostRef,
    filterId: dropdownFilterId,
    mapId: dropdownMapId,
    mapUrl: dropdownMapUrl,
    filterSize: dropdownFilterSize,
    filterStyle: dropdownFilterStyle,
    borderRadius: dropdownBorderRadius,
    variantClass: dropdownVariantClass,
  } = useLiquidGlassEffect<HTMLUListElement>(dropdownGlassParams, {
    baseClass: 'select-liquid-glass__dropdown',
    variant,
  })

  const floatingStyle = useFloatingPosition({
    enabled: open,
    triggerRef: rootRef,
    floatingRef: dropdownRef,
    placement: 'bottom',
    align: 'start',
    offset: 4,
    matchTriggerWidth: true,
  })

  const sizeClass = size === 'md' ? '' : ` select-liquid-glass--${size}`
  const selected = options.find((option) => option.value === value)

  const setValue = (next: string) => {
    if (!isControlled) setUncontrolledValue(next)
    onChange?.({
      target: { value: next },
    } as ChangeEvent<HTMLSelectElement>)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || dropdownRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

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
        ref={(node) => {
          hostRef.current = node
          rootRef.current = node
        }}
        className={`select-liquid-glass${sizeClass}${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
      >
        <button
          ref={triggerRef}
          type="button"
          className="select-liquid-glass__trigger"
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
        >
          <span className="select-liquid-glass__value">
            {selected?.label ?? placeholder}
          </span>
          <span className="select-liquid-glass__arrow" aria-hidden />
        </button>
      </div>
      {open &&
        createPortal(
          <>
            <LiquidGlassFilter
              filterId={dropdownFilterId}
              mapId={dropdownMapId}
              mapUrl={dropdownMapUrl}
              width={dropdownFilterSize.width}
              height={dropdownFilterSize.height}
            />
            <ul
              ref={(node) => {
                dropdownHostRef.current = node
                dropdownRef.current = node
              }}
              role="listbox"
              className={`select-liquid-glass__dropdown${dropdownVariantClass}`}
              style={{
                ...dropdownFilterStyle,
                borderRadius: dropdownBorderRadius,
                ...floatingStyle,
              }}
            >
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    className={`select-liquid-glass__option${
                      option.value === value ? ' select-liquid-glass__option--selected' : ''
                    }`}
                    disabled={option.disabled}
                    onClick={() => setValue(option.value)}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </>,
          document.body,
        )}
    </>
  )
}

export default SelectLiquidGlass
