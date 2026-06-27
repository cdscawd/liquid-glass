import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './ResultLiquidGlass.scss'

export type ResultLiquidGlassStatus = 'success' | 'error' | 'info' | 'warning'

export interface ResultLiquidGlassProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  status?: ResultLiquidGlassStatus
  title?: ReactNode
  subTitle?: ReactNode
  icon?: ReactNode
  extra?: ReactNode
}

const STATUS_ICON: Record<ResultLiquidGlassStatus, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '!',
}

export function ResultLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  status = 'info',
  title,
  subTitle,
  icon,
  extra,
  className = '',
  style,
  children,
  ...props
}: ResultLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams)

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
        className={`result-liquid-glass result-liquid-glass--${status}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        <div className="result-liquid-glass__icon" aria-hidden>
          {icon ?? STATUS_ICON[status]}
        </div>
        {title && <div className="result-liquid-glass__title">{title}</div>}
        {subTitle && <div className="result-liquid-glass__subtitle">{subTitle}</div>}
        {children && <div className="result-liquid-glass__content"><HostBoundary>{children}</HostBoundary></div>}
        {extra && <div className="result-liquid-glass__extra">{extra}</div>}
      </div>
    </>
  )
}

export default ResultLiquidGlass
