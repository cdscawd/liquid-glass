import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './LiquidGlassAnchor.scss'

export interface LiquidGlassAnchorLink {
  key: string
  href: string
  title: ReactNode
}

export interface LiquidGlassAnchorProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  links: LiquidGlassAnchorLink[]
  offsetTop?: number
}

export function LiquidGlassAnchor({
  glassParams,
  links,
  offsetTop = 80,
  className = '',
  style,
  ...props
}: LiquidGlassAnchorProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams)

  const handleClick = (href: string) => {
    const id = href.replace(/^#/, '')
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - offsetTop
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <>
      <LiquidGlassFilter
        filterId={filterId}
        mapId={mapId}
        mapUrl={mapUrl}
        width={filterSize.width}
        height={filterSize.height}
      />
      <nav
        ref={hostRef}
        className={`liquid-glass-anchor${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        aria-label="Anchor navigation"
        {...props}
      >
        {links.map((link) => (
          <a
            key={link.key}
            href={link.href}
            className="liquid-glass-anchor__link"
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

export default LiquidGlassAnchor
