import { type HTMLAttributes } from 'react'
import {
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './PaginationLiquidGlass.scss'

export interface PaginationLiquidGlassProps extends HTMLAttributes<HTMLElement> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  variant?: LiquidGlassVariant
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function PaginationLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  variant,
  page = 1,
  totalPages = 1,
  onPageChange,
  className = '',
  style,
  ...props
}: PaginationLiquidGlassProps) {
  const {
    hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass,
    isFilterActive
  } =
    useLiquidGlassEffect<HTMLElement>(glassParams, { baseClass: 'pagination-liquid-glass', variant })

  const canPrev = page > 1
  const canNext = page < totalPages

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
        aria-label="Pagination"
        className={`pagination-liquid-glass${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        <button
          type="button"
          className="pagination-liquid-glass__btn"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange?.(page - 1)}
        >
          ‹
        </button>
        <span className="pagination-liquid-glass__info">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          className="pagination-liquid-glass__btn"
          disabled={!canNext}
          onClick={() => canNext && onPageChange?.(page + 1)}
        >
          ›
        </button>
      </nav>
    </>
  )
}

export default PaginationLiquidGlass
