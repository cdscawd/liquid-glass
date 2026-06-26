import {
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import { DEFAULT_BORDER_RADIUS } from '../../lib/liquid-glass/constants'
import { useAnchorFollowPosition } from '../../lib/useAnchorFollowPosition'
import './SelectLiquidGlass.scss'

export type SelectLiquidGlassSize = 'sm' | 'md' | 'lg'

export interface SelectLiquidGlassOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface SelectLiquidGlassProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  glassParams?: LiquidGlassParams
  /** 下拉面板玻璃参数，默认与 glassParams 相同 */
  dropdownGlassParams?: LiquidGlassParams
  variant?: LiquidGlassVariant
  size?: SelectLiquidGlassSize
  options?: SelectLiquidGlassOption[]
  value?: string
  defaultValue?: string
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
  disabled?: boolean
  placeholder?: string
  name?: string
}

function findSelectedLabel(
  options: SelectLiquidGlassOption[],
  value: string | undefined,
): ReactNode | undefined {
  if (value === undefined) return undefined
  return options.find((opt) => opt.value === value)?.label
}

export function SelectLiquidGlass({
  glassParams,
  dropdownGlassParams,
  variant,
  size = 'md',
  options = [],
  value: valueProp,
  defaultValue,
  onChange,
  disabled = false,
  placeholder = '请选择',
  name,
  className = '',
  style,
  ...props
}: SelectLiquidGlassProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? options[0]?.value ?? '')
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolled

  const [open, setOpen] = useState(false)

  const {
    hostRef: triggerHostRef,
    filterId: triggerFilterId,
    mapId: triggerMapId,
    mapUrl: triggerMapUrl,
    filterSize: triggerFilterSize,
    filterStyle: triggerFilterStyle,
    borderRadius: triggerRadius,
    variantClass,
  } = useLiquidGlassEffect<HTMLDivElement>(glassParams, {
    baseClass: 'select-liquid-glass',
    variant,
  })

  const dropdownGlass: LiquidGlassParams = {
    ...(dropdownGlassParams ?? glassParams),
    borderRadius: dropdownGlassParams?.borderRadius ?? DEFAULT_BORDER_RADIUS,
  }

  const {
    hostRef: dropdownHostRef,
    filterId: dropdownFilterId,
    mapId: dropdownMapId,
    mapUrl: dropdownMapUrl,
    filterSize: dropdownFilterSize,
    filterStyle: dropdownFilterStyle,
    borderRadius: dropdownRadius,
  } = useLiquidGlassEffect<HTMLUListElement>(dropdownGlass, {
    baseClass: 'select-liquid-glass__dropdown',
    variant,
  })

  const measurePosition = useCallback((rect: DOMRect) => ({
    top: rect.bottom + 6,
    left: rect.left,
    width: rect.width,
  }), [])

  const position = useAnchorFollowPosition(
    triggerHostRef,
    open && !disabled,
    measurePosition,
  )

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (
        triggerHostRef.current?.contains(target) ||
        dropdownHostRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [open, dropdownHostRef])

  const selectValue = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next)
      onChange?.({ target: { value: next } } as ChangeEvent<HTMLSelectElement>)
      setOpen(false)
    },
    [isControlled, onChange],
  )

  const selectedLabel = findSelectedLabel(options, value)
  const sizeClass = size === 'md' ? '' : ` select-liquid-glass--${size}`

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
    }
    if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <>
      <LiquidGlassFilter
        filterId={triggerFilterId}
        mapId={triggerMapId}
        mapUrl={triggerMapUrl}
        width={triggerFilterSize.width}
        height={triggerFilterSize.height}
      />
      <div
        ref={triggerHostRef}
        className={`select-liquid-glass${sizeClass}${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...triggerFilterStyle, borderRadius: triggerRadius, ...style }}
        {...props}
      >
        <button
          type="button"
          className="select-liquid-glass__trigger"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          onKeyDown={onTriggerKeyDown}
        >
          <span className="select-liquid-glass__value">
            {selectedLabel ?? placeholder}
          </span>
          <span className="select-liquid-glass__arrow" aria-hidden />
        </button>
        {name && value !== undefined && (
          <input type="hidden" name={name} value={value} readOnly />
        )}
      </div>

      {open &&
        !disabled &&
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
              ref={dropdownHostRef}
              role="listbox"
              className={`select-liquid-glass__dropdown${variantClass}`}
              style={{
                ...dropdownFilterStyle,
                borderRadius: dropdownRadius,
                top: position.top,
                left: position.left,
                minWidth: position.width,
              }}
            >
              {options.map((opt) => {
                const selected = opt.value === value
                return (
                  <li key={opt.value} role="none">
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      disabled={opt.disabled}
                      className={`select-liquid-glass__option${selected ? ' select-liquid-glass__option--selected' : ''}`}
                      onClick={() => !opt.disabled && selectValue(opt.value)}
                    >
                      {opt.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </>,
          document.body,
        )}
    </>
  )
}

export default SelectLiquidGlass
