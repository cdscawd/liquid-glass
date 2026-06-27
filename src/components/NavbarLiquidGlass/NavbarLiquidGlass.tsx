import { type HTMLAttributes, type ReactNode } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './NavbarLiquidGlass.scss'

export interface NavbarLiquidGlassProps extends HTMLAttributes<HTMLElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  brand?: ReactNode
  children?: ReactNode
}

export function NavbarLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  brand,
  children,
  className = '',
  style,
  ...props
}: NavbarLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLElement>(glassParams, { baseClass: 'navbar-liquid-glass', variant })

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
        className={`navbar-liquid-glass${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {brand && <div className="navbar-liquid-glass__brand">{brand}</div>}
        <div className="navbar-liquid-glass__actions"><HostBoundary>{children}</HostBoundary></div>
      </nav>
    </>
  )
}

export default NavbarLiquidGlass
