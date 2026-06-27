import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './AlertLiquidGlass.scss'

export type AlertLiquidGlassVariant = LiquidGlassVariant | 'warning'

export interface AlertLiquidGlassProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  title?: ReactNode
  children?: ReactNode
  variant?: AlertLiquidGlassVariant
}

export function AlertLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  title,
  children,
  variant = 'default',
  className = '',
  style,
  ...props
}: AlertLiquidGlassProps) {
  const isWarning = variant === 'warning'
  const tone: LiquidGlassVariant | undefined = isWarning ? undefined : variant

  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      baseClass: 'alert-liquid-glass',
      variant: tone,
    })

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
        role="alert"
        className={`alert-liquid-glass${isWarning ? ' alert-liquid-glass--warning' : ''}${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {title && <div className="alert-liquid-glass__title">{title}</div>}
        {children && <div className="alert-liquid-glass__body"><HostBoundary>{children}</HostBoundary></div>}
      </div>
    </>
  )
}

export default AlertLiquidGlass
