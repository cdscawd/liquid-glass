import { useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useFloatingPosition } from '../../lib/useFloatingPosition'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './TooltipLiquidGlass.scss'

export interface TooltipLiquidGlassProps {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  content: ReactNode
  children: ReactNode
  open?: boolean
}

export function TooltipLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  content,
  children,
  open: openProp,
}: TooltipLiquidGlassProps) {
  const [hoverOpen, setHoverOpen] = useState(false)
  const open = openProp ?? hoverOpen

  const triggerRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

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
    placement: 'top',
    align: 'center',
    offset: 8,
  })

  return (
    <>
      <span
        ref={triggerRef}
        className="tooltip-liquid-glass__anchor"
        onMouseEnter={() => openProp === undefined && setHoverOpen(true)}
        onMouseLeave={() => openProp === undefined && setHoverOpen(false)}
        onFocus={() => openProp === undefined && setHoverOpen(true)}
        onBlur={() => openProp === undefined && setHoverOpen(false)}
      >
        <HostBoundary>{children}</HostBoundary>
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
              role="tooltip"
              className="tooltip-liquid-glass"
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

export default TooltipLiquidGlass
