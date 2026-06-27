import { type HTMLAttributes, type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './ModalLiquidGlass.scss'

export interface ModalLiquidGlassProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  open?: boolean
  title?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  onClose?: () => void
}

export function ModalLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  open = false,
  title,
  children,
  footer,
  onClose,
  className = '',
  style,
  ...props
}: ModalLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      baseClass: 'modal-liquid-glass',
      variant,
      filterMode,
      nestedPolicy,
      enabled: open,
    })

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="modal-liquid-glass__root">
      <button
        type="button"
        className="modal-liquid-glass__backdrop"
        aria-label="Close modal"
        onClick={onClose}
      />
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
        role="dialog"
        aria-modal="true"
        className={`modal-liquid-glass${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {title && <div className="modal-liquid-glass__title">{title}</div>}
        <div className="modal-liquid-glass__body"><HostBoundary>{children}</HostBoundary></div>
        {footer && <div className="modal-liquid-glass__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}

export default ModalLiquidGlass
