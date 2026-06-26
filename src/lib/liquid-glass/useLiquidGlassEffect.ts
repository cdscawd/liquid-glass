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

function scheduleIdle(callback: () => void, timeout = 120): number {
  if (typeof window.requestIdleCallback === 'function') {
    return window.requestIdleCallback(() => callback(), { timeout })
  }
  return globalThis.setTimeout(callback, 1)
}

function cancelIdle(id: number) {
  if (typeof window.cancelIdleCallback === 'function') {
    window.cancelIdleCallback(id)
  } else {
    globalThis.clearTimeout(id)
  }
}

export function useLiquidGlassEffect<T extends HTMLElement>(
  glassParams?: LiquidGlassParams,
): UseLiquidGlassEffectResult<T> {
  const reactId = useId().replace(/:/g, '')
  const filterId = `liquid-glass-${reactId}`
  const mapId = `${filterId}-map`

  const hostRef = useRef<T>(null)
  const [mapUrl, setMapUrl] = useState('')
  const [filterSize, setFilterSize] = useState({ width: 0, height: 0 })

  const lastSizeRef = useRef({ width: 0, height: 0 })
  const idleIdRef = useRef<number | null>(null)
  const measureRafRef = useRef<number | null>(null)
  const debounceMeasureRef = useRef<number | null>(null)

  const lastMapKeyRef = useRef('')

  const borderRadius = glassParams?.borderRadius ?? DEFAULT_BORDER_RADIUS

  const updateMap = useCallback(
    (width: number, height: number) => {
      if (width < 2 || height < 2) return

      const mapKey = `${width}x${height}:${borderRadius}:${glassParams?.edgeFalloff ?? ''}:${glassParams?.strength ?? ''}`
      if (lastMapKeyRef.current === mapKey) return

      lastMapKeyRef.current = mapKey
      lastSizeRef.current = { width, height }
      setFilterSize({ width, height })

      if (idleIdRef.current !== null) {
        cancelIdle(idleIdRef.current)
      }

      idleIdRef.current = scheduleIdle(() => {
        idleIdRef.current = null
        setMapUrl(
          generateDisplacementMap({
            width,
            height,
            borderRadius,
            edgeFalloff: glassParams?.edgeFalloff,
            strength: glassParams?.strength,
          }),
        )
      })
    },
    [borderRadius, glassParams?.edgeFalloff, glassParams?.strength],
  )

  useEffect(() => {
    const el = hostRef.current
    if (!el) return

    const measure = () => {
      if (measureRafRef.current !== null) {
        cancelAnimationFrame(measureRafRef.current)
      }

      measureRafRef.current = requestAnimationFrame(() => {
        measureRafRef.current = null
        const { width, height } = el.getBoundingClientRect()
        const w = Math.round(width)
        const h = Math.round(height)

        if (debounceMeasureRef.current !== null) {
          window.clearTimeout(debounceMeasureRef.current)
        }

        debounceMeasureRef.current = window.setTimeout(() => {
          debounceMeasureRef.current = null
          updateMap(w, h)
        }, 32)
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (measureRafRef.current !== null) {
        cancelAnimationFrame(measureRafRef.current)
      }
      if (idleIdRef.current !== null) {
        cancelIdle(idleIdRef.current)
      }
      if (debounceMeasureRef.current !== null) {
        window.clearTimeout(debounceMeasureRef.current)
      }
    }
  }, [updateMap])

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
