import {
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import { useAnchorFollowPosition } from '../../lib/useAnchorFollowPosition'
import './PopoverLiquidGlass.scss'

export interface PopoverLiquidGlassProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  glassParams?: LiquidGlassParams
  variant?: LiquidGlassVariant
  trigger: ReactNode
  content: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PopoverLiquidGlass({
  glassParams,
  variant,
  trigger,
  content,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className = '',
  style,
  ...props
}: PopoverLiquidGlassProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolled

  const anchorRef = useRef<HTMLSpanElement>(null)

  const measurePosition = useCallback(
    (rect: DOMRect) => ({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    }),
    [],
  )

  const position = useAnchorFollowPosition(anchorRef, open, measurePosition)

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, { baseClass: 'popover-liquid-glass', variant })

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (
        anchorRef.current?.contains(target) ||
        hostRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [open, setOpen, hostRef])

  return (
    <>
      <span
        ref={anchorRef}
        role="button"
        tabIndex={0}
        className="popover-liquid-glass__trigger"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen(!open)
          }
        }}
      >
        {trigger}
      </span>
      {open &&
        createPortal(
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
              role="dialog"
              className={`popover-liquid-glass${variantClass}${className ? ` ${className}` : ''}`}
              style={{
                ...filterStyle,
                borderRadius,
                top: position.top,
                left: position.left,
                ...style,
              }}
              {...props}
            >
              {content}
            </div>
          </>,
          document.body,
        )}
    </>
  )
}

export default PopoverLiquidGlass
