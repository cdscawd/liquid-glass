import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './AnchorLiquidGlass.scss'

export interface AnchorLiquidGlassLink {
  key: string
  href: string
  title: ReactNode
}

export interface AnchorLiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  links: AnchorLiquidGlassLink[]
  offsetTop?: number
}

export function AnchorLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  links,
  offsetTop = 80,
  className = '',
  style,
  ...props
}: AnchorLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, { baseClass: 'anchor-liquid-glass', variant })

  const handleClick = (href: string) => {
    const id = href.replace(/^#/, '')
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - offsetTop
    window.scrollTo({ top, behavior: 'smooth' })
  }

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
        className={`anchor-liquid-glass${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        aria-label="Anchor navigation"
        {...props}
      >
        {links.map((link) => (
          <a
            key={link.key}
            href={link.href}
            className="anchor-liquid-glass__link"
            onClick={(e) => {
              e.preventDefault()
              handleClick(link.href)
            }}
          >
            {link.title}
          </a>
        ))}
      </nav>
    </>
  )
}

export default AnchorLiquidGlass
