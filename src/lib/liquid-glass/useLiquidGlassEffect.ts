import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import { DEFAULT_BORDER_RADIUS, BACKDROP_FILTER } from './constants'
import { generateDisplacementMap } from './generateDisplacementMap'
import type { LiquidGlassParams } from './types'

export interface UseLiquidGlassEffectResult<T extends HTMLElement> {
  hostRef: RefObject<T | null>
  filterId: string
  mapId: string
  mapUrl: string
  filterSize: { width: number; height: number }
  filterStyle: CSSProperties
  borderRadius: number
}

export function useLiquidGlassEffect<T extends HTMLElement>(
  glassParams?: LiquidGlassParams,
  observeDeps: unknown[] = [],
): UseLiquidGlassEffectResult<T> {
  const reactId = useId().replace(/:/g, '')
  const filterId = `liquid-glass-${reactId}`
  const mapId = `${filterId}-map`

  const hostRef = useRef<T>(null)
  const [mapUrl, setMapUrl] = useState('')
  const [filterSize, setFilterSize] = useState({ width: 0, height: 0 })

  const borderRadius = glassParams?.borderRadius ?? DEFAULT_BORDER_RADIUS

  const updateMap = useCallback(
    (width: number, height: number) => {
      if (width < 2 || height < 2) return
      setFilterSize({ width, height })
      setMapUrl(
        generateDisplacementMap({
          width,
          height,
          borderRadius,
          edgeFalloff: glassParams?.edgeFalloff,
          strength: glassParams?.strength,
        }),
      )
    },
    [borderRadius, glassParams?.edgeFalloff, glassParams?.strength],
  )

  useEffect(() => {
    const el = hostRef.current
    if (!el) return

    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      updateMap(Math.round(width), Math.round(height))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- observeDeps 由调用方传入（如 children）
  }, [updateMap, ...observeDeps])

  const filterStyle = useMemo(
    (): CSSProperties => ({
      backdropFilter: `url(#${filterId}) ${BACKDROP_FILTER}`,
      WebkitBackdropFilter: `url(#${filterId}) ${BACKDROP_FILTER}`,
    }),
    [filterId],
  )

  return {
    hostRef,
    filterId,
    mapId,
    mapUrl,
    filterSize,
    filterStyle,
    borderRadius,
  }
}
