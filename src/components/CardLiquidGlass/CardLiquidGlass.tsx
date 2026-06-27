import { type HTMLAttributes, type ReactNode, useLayoutEffect } from 'react'
import {
  LiquidGlassFilter,
  isPillBorderRadius,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './CardLiquidGlass.scss'

export type CardLiquidGlassSize = 'sm' | 'md' | 'lg'

export interface CardLiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  size?: CardLiquidGlassSize
  children: ReactNode
}

function CardLiquidGlassSection({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`card-liquid-glass__section${className ? ` ${className}` : ''}`} {...props} />
}

export function CardLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  size = 'md',
  className = '',
  style,
  children,
  ...props
}: CardLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      baseClass: 'card-liquid-glass',
      variant,
    })

  const isPill = isPillBorderRadius(borderRadius)
  const sizeClass = size === 'md' ? '' : ` card-liquid-glass--${size}`
  const pillClass = isPill ? ' card-liquid-glass--pill' : ''

  useLayoutEffect(() => {
    const el = hostRef.current
    if (!el || !isPill) {
      el?.style.removeProperty('--card-pill-inline')
      return
    }

    const sync = () => {
      const { width, height } = el.getBoundingClientRect()
      if (height < 2) return
      const capRadius = Math.min(borderRadius, height / 2, width / 2)
      el.style.setProperty('--card-pill-inline', `${Math.ceil(capRadius + 12)}px`)
    }

    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => {
      observer.disconnect()
      el.style.removeProperty('--card-pill-inline')
    }
  }, [borderRadius, hostRef, isPill])

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
        className={`card-liquid-glass${sizeClass}${pillClass}${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        <HostBoundary>{children}</HostBoundary>
      </div>
    </>
  )
}

CardLiquidGlass.Header = function CardLiquidGlassHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <CardLiquidGlassSection className="card-liquid-glass__header" {...props} />
}

CardLiquidGlass.Body = function CardLiquidGlassBody(props: HTMLAttributes<HTMLDivElement>) {
  return <CardLiquidGlassSection className="card-liquid-glass__body" {...props} />
}

CardLiquidGlass.Footer = function CardLiquidGlassFooter(props: HTMLAttributes<HTMLDivElement>) {
  return <CardLiquidGlassSection className="card-liquid-glass__footer" {...props} />
}

export default CardLiquidGlass
