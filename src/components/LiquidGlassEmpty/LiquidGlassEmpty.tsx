import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassEmpty.scss'

export interface LiquidGlassEmptyProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  description?: ReactNode
  image?: ReactNode
}

export function LiquidGlassEmpty({
  glassParams,
  description = '暂无数据',
  image,
  className = '',
  style,
  children,
  ...props
}: LiquidGlassEmptyProps) {
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
        className={`liquid-glass-empty${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        <div className="liquid-glass-empty__image">
          {image ?? <span className="liquid-glass-empty__icon" aria-hidden>◌</span>}
        </div>
        <div className="liquid-glass-empty__desc">{description}</div>
        {children && <div className="liquid-glass-empty__footer">{children}</div>}
      </div>
    </>
  )
}

export default LiquidGlassEmpty
