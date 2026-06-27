import { type HTMLAttributes, type ReactNode } from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './AvatarLiquidGlass.scss'

export type AvatarLiquidGlassSize = 'sm' | 'md' | 'lg'

export interface AvatarLiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  size?: AvatarLiquidGlassSize
  src?: string
  alt?: string
  fallback?: ReactNode
}

export function AvatarLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  size = 'md',
  src,
  alt = '',
  fallback,
  className = '',
  style,
  children,
  ...props
}: AvatarLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.pill },
      baseClass: 'avatar-liquid-glass',
      variant,
    })

  const sizeClass = size === 'md' ? '' : ` avatar-liquid-glass--${size}`

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
        className={`avatar-liquid-glass${sizeClass}${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {src ? (
          <img className="avatar-liquid-glass__img" src={src} alt={alt} />
        ) : (
          <span className="avatar-liquid-glass__fallback">
            {fallback ?? children ?? '?'}
          </span>
        )}
      </div>
    </>
  )
}

export default AvatarLiquidGlass
