import {
  createElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FC,
  type ReactNode,
  type RefObject,
} from 'react'
import { BACKDROP_FILTER } from './constants'
import {
  LiquidGlassHostBoundary,
  useLiquidGlassFilterContext,
} from './LiquidGlassFilterContext'
import {
  useLiquidGlassDefaults,
  useLiquidGlassNestedPolicyDefault,
  useLiquidGlassVariantDefault,
} from './LiquidGlassProvider'
import { generateDisplacementMap } from './generateDisplacementMap'
import { resolveEffectiveFilterMode } from './resolveEffectiveFilterMode'
import { resolveGlassParams, glassParamsMapKey } from './resolveGlassParams'
import type {
  LiquidGlassFilterMode,
  LiquidGlassNestedPolicy,
  LiquidGlassParams,
} from './types'
import {
  liquidGlassVariantClass,
  resolveLiquidGlassVariant,
  type LiquidGlassVariant,
} from './variant'

export interface UseLiquidGlassEffectOptions {
  preset?: Partial<LiquidGlassParams>
  /** 组件根 class，用于生成 --primary 等 modifier */
  baseClass?: string
  variant?: LiquidGlassVariant
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  /** 宿主未挂载时为 false（如 Portal 面板关闭），恢复测量 */
  enabled?: boolean
}

export interface UseLiquidGlassEffectResult<T extends HTMLElement> {
  hostRef: RefObject<T | null>
  filterId: string
  mapId: string
  mapUrl: string
  filterSize: { width: number; height: number }
  filterStyle: CSSProperties
  borderRadius: number
  resolvedParams: LiquidGlassParams
  variant: LiquidGlassVariant
  variantClass: string
  effectiveFilterMode: 'filter' | 'surface'
  isFilterActive: boolean
  HostBoundary: FC<{ children: ReactNode }>
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
  options?: UseLiquidGlassEffectOptions,
): UseLiquidGlassEffectResult<T> {
  const contextParams = useLiquidGlassDefaults()
  const contextVariant = useLiquidGlassVariantDefault()
  const contextNestedPolicy = useLiquidGlassNestedPolicyDefault()
  const { activeFilterDepth, isStackLayer } = useLiquidGlassFilterContext()

  const resolvedVariant = resolveLiquidGlassVariant(options?.variant, contextVariant)
  const variantClass = options?.baseClass
    ? liquidGlassVariantClass(options.baseClass, resolvedVariant)
    : ''
  const resolvedParams = resolveGlassParams(
    glassParams,
    contextParams,
    options?.preset,
  )

  const nestedPolicy = options?.nestedPolicy ?? contextNestedPolicy
  const effectiveFilterMode = resolveEffectiveFilterMode(
    options?.filterMode,
    nestedPolicy,
    activeFilterDepth,
    isStackLayer,
  )
  const isFilterActive = effectiveFilterMode === 'filter'
  const isEnabled = options?.enabled !== false
  const shouldMeasure = isFilterActive && isEnabled

  const reactId = useId().replace(/:/g, '')
  const filterId = `liquid-glass-${reactId}`
  const mapId = `${filterId}-map`

  const hostRef = useRef<T>(null)
  const [mapUrl, setMapUrl] = useState('')
  const [filterSize, setFilterSize] = useState({ width: 0, height: 0 })

  const idleIdRef = useRef<number | null>(null)
  const measureRafRef = useRef<number | null>(null)
  const debounceMeasureRef = useRef<number | null>(null)
  const lastMapKeyRef = useRef('')

  const updateMap = useCallback(
    (width: number, height: number) => {
      if (!isFilterActive) return
      if (width < 2 || height < 2) return

      const mapKey = glassParamsMapKey(width, height, resolvedParams)
      if (lastMapKeyRef.current === mapKey) return

      lastMapKeyRef.current = mapKey
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
            ...resolvedParams,
          }),
        )
      })
    },
    [isFilterActive, resolvedParams],
  )

  useEffect(() => {
    if (!shouldMeasure) return

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
  }, [shouldMeasure, updateMap])

  const filterStyle = useMemo((): CSSProperties => {
    if (!isFilterActive) return {}

    return {
      backdropFilter: `url(#${filterId}) ${BACKDROP_FILTER}`,
      WebkitBackdropFilter: `url(#${filterId}) ${BACKDROP_FILTER}`,
    }
  }, [filterId, isFilterActive])

  const HostBoundary = useMemo(
    (): FC<{ children: ReactNode }> =>
      function LiquidGlassHostBoundaryWrapper({ children }) {
        return createElement(LiquidGlassHostBoundary, {
          enabled: isFilterActive,
          children,
        })
      },
    [isFilterActive],
  )

  return {
    hostRef,
    filterId,
    mapId,
    mapUrl,
    filterSize,
    filterStyle,
    borderRadius: resolvedParams.borderRadius ?? 8,
    resolvedParams,
    variant: resolvedVariant,
    variantClass,
    effectiveFilterMode,
    isFilterActive,
    HostBoundary,
  }
}
