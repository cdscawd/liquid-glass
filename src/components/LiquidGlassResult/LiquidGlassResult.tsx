import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassResult.scss'

export type LiquidGlassResultStatus = 'success' | 'error' | 'info' | 'warning'

export interface LiquidGlassResultProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  glassParams?: LiquidGlassParams
  status?: LiquidGlassResultStatus
  title?: ReactNode
  subTitle?: ReactNode
  icon?: ReactNode
  extra?: ReactNode
}

const STATUS_ICON: Record<LiquidGlassResultStatus, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '!',
}

export function LiquidGlassResult({
  glassParams,
  status = 'info',
  title,
  subTitle,
  icon,
  extra,
  className = '',
  style,
  children,
  ...props
}: LiquidGlassResultProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams)

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
        className={`liquid-glass-result liquid-glass-result--${status}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        <div className="liquid-glass-result__icon" aria-hidden>
          {icon ?? STATUS_ICON[status]}
        </div>
        {title && <div className="liquid-glass-result__title">{title}</div>}
        {subTitle && <div className="liquid-glass-result__subtitle">{subTitle}</div>}
        {children && <div className="liquid-glass-result__content">{children}</div>}
        {extra && <div className="liquid-glass-result__extra">{extra}</div>}
      </div>
    </>
  )
}

export default LiquidGlassResult
