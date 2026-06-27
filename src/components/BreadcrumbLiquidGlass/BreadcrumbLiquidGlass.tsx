import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './BreadcrumbLiquidGlass.scss'

export interface BreadcrumbLiquidGlassItem {
  label: ReactNode
  href?: string
  onClick?: () => void
}

export interface BreadcrumbLiquidGlassProps extends HTMLAttributes<HTMLElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  items: BreadcrumbLiquidGlassItem[]
}

export function BreadcrumbLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  items,
  className = '',
  style,
  ...props
}: BreadcrumbLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLElement>(glassParams, { baseClass: 'breadcrumb-liquid-glass', variant })

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
      <nav
        ref={hostRef}
        aria-label="Breadcrumb"
        className={`breadcrumb-liquid-glass${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        <ol className="breadcrumb-liquid-glass__list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={index} className="breadcrumb-liquid-glass__item">
                {item.href && !isLast ? (
                  <a href={item.href} className="breadcrumb-liquid-glass__link">
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={`breadcrumb-liquid-glass__link${isLast ? ' breadcrumb-liquid-glass__link--current' : ''}`}
                    disabled={isLast}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                )}
                {!isLast && (
                  <span className="breadcrumb-liquid-glass__sep" aria-hidden>
                    /
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

export default BreadcrumbLiquidGlass
