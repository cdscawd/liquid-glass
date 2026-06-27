import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useFloatingPosition } from '../../lib/useFloatingPosition'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './PopoverLiquidGlass.scss'

export interface PopoverLiquidGlassProps {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  trigger: ReactNode
  content: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PopoverLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  trigger,
  content,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: PopoverLiquidGlassProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen

  const rootRef = useRef<HTMLSpanElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, { filterMode, nestedPolicy, enabled: open })

  const floatingStyle = useFloatingPosition({
    enabled: open,
    triggerRef,
    floatingRef: panelRef,
    placement: 'bottom',
    align: 'center',
    offset: 8,
  })

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, isControlled, onOpenChange])

  return (
    <>
      <span ref={rootRef} className="popover-liquid-glass__anchor">
        <span
          ref={triggerRef}
          className="popover-liquid-glass__trigger-wrap"
          onClick={() => setOpen(!open)}
        >
          {trigger}
        </span>
      </span>
      {open &&
        createPortal(
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
              ref={(node) => {
                hostRef.current = node
                panelRef.current = node
              }}
              className="popover-liquid-glass"
              style={{ ...filterStyle, borderRadius, ...floatingStyle }}
            >
              <HostBoundary>{content}</HostBoundary>
            </div>
          </>,
          document.body,
        )}
    </>
  )
}

export default PopoverLiquidGlass
