import {
  type ButtonHTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  PILL_BORDER_RADIUS,
  useLiquidGlassEffect,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './SwitchLiquidGlass.scss'

const THUMB_INSET = 2
const DRAG_THRESHOLD = 4

const TRACK_SIZE = {
  sm: { width: 42, height: 26 },
  md: { width: 52, height: 32 },
  lg: { width: 60, height: 36 },
} as const

const TRACK_BORDER = 2

function getInnerTrackSize(size: SwitchLiquidGlassSize) {
  const outer = TRACK_SIZE[size]
  return {
    width: outer.width - TRACK_BORDER,
    height: outer.height - TRACK_BORDER,
  }
}

export type SwitchLiquidGlassSize = 'sm' | 'md' | 'lg'

export interface SwitchLiquidGlassProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  glassParams?: LiquidGlassParams
  thumbGlassParams?: LiquidGlassParams
  size?: SwitchLiquidGlassSize
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function getThumbRadius(borderRadius: number, height: number): number {
  if (borderRadius >= PILL_BORDER_RADIUS || borderRadius >= height / 2) {
    return PILL_BORDER_RADIUS
  }
  return Math.max(0, borderRadius - 1)
}

export function SwitchLiquidGlass({
  glassParams,
  thumbGlassParams,
  size = 'md',
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  className = '',
  style,
  disabled,
  onClick,
  ...props
}: SwitchLiquidGlassProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked)
  const isControlled = checkedProp !== undefined
  const checked = isControlled ? checkedProp : uncontrolled

  const trackRef = useRef<HTMLButtonElement>(null)
  const ignoreClickRef = useRef(false)
  const dragStateRef = useRef<{
    pointerId: number
    startX: number
    startThumbLeft: number
    didDrag: boolean
    lastClientX: number
  } | null>(null)

  const [trackSize, setTrackSize] = useState(getInnerTrackSize(size))
  const [isDragging, setIsDragging] = useState(false)
  const [dragSessionId, setDragSessionId] = useState(0)
  const [dragThumbLeft, setDragThumbLeft] = useState<number | null>(null)

  const setChecked = useCallback(
    (next: boolean) => {
      if (disabled) return
      if (!isControlled) setUncontrolled(next)
      onCheckedChange?.(next)
    },
    [disabled, isControlled, onCheckedChange],
  )

  const toggle = useCallback(() => {
    setChecked(!checked)
  }, [checked, setChecked])

  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius } =
    useLiquidGlassEffect<HTMLButtonElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.pill },
    })

  useLayoutEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => {
      const width = el.clientWidth
      const height = el.clientHeight
      if (width > 0 && height > 0) {
        setTrackSize({ width, height })
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [size])

  const thumbHeight = Math.max(trackSize.height - THUMB_INSET * 2, 0)
  const thumbWidth = thumbHeight
  const offLeft = THUMB_INSET
  const onLeft = Math.max(trackSize.width - thumbWidth - THUMB_INSET, THUMB_INSET)
  const restingThumbLeft = checked ? onLeft : offLeft
  const thumbLeft = dragThumbLeft ?? restingThumbLeft

  const thumbRadius = getThumbRadius(
    thumbGlassParams?.borderRadius ?? GLASS_SHAPE.pill,
    thumbHeight,
  )

  const clampThumbLeft = useCallback(
    (left: number) => {
      return Math.min(Math.max(left, offLeft), onLeft)
    },
    [offLeft, onLeft],
  )

  const snapFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      setChecked(clientX - rect.left >= rect.width / 2)
    },
    [setChecked],
  )

  const endDragSession = useCallback(
    (clientX?: number) => {
      const dragState = dragStateRef.current
      const track = trackRef.current

      if (!dragState) {
        setIsDragging(false)
        setDragThumbLeft(null)
        return
      }

      const resolvedClientX = clientX ?? dragState.lastClientX

      if (track?.hasPointerCapture(dragState.pointerId)) {
        track.releasePointerCapture(dragState.pointerId)
      }

      if (resolvedClientX !== undefined) {
        if (dragState.didDrag) {
          snapFromClientX(resolvedClientX)
        } else {
          toggle()
        }
      }

      dragStateRef.current = null
      setIsDragging(false)
      setDragThumbLeft(null)

      ignoreClickRef.current = true
      window.setTimeout(() => {
        ignoreClickRef.current = false
      }, 0)
    },
    [snapFromClientX, toggle],
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || disabled || dragStateRef.current) return

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startThumbLeft: restingThumbLeft,
      didDrag: false,
      lastClientX: event.clientX,
    }
    setDragSessionId((id) => id + 1)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  useEffect(() => {
    if (dragSessionId === 0 || !dragStateRef.current) return

    const onPointerMove = (event: PointerEvent) => {
      const state = dragStateRef.current
      if (!state || event.pointerId !== state.pointerId) return

      state.lastClientX = event.clientX

      const deltaX = event.clientX - state.startX
      if (!state.didDrag && Math.abs(deltaX) >= DRAG_THRESHOLD) {
        state.didDrag = true
        setIsDragging(true)
      }

      if (!state.didDrag) return

      setDragThumbLeft(clampThumbLeft(state.startThumbLeft + deltaX))
    }

    const onPointerEnd = (event: PointerEvent) => {
      const state = dragStateRef.current
      if (!state || event.pointerId !== state.pointerId) return
      endDragSession(event.clientX)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerEnd)
    window.addEventListener('pointercancel', onPointerEnd)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerEnd)
      window.removeEventListener('pointercancel', onPointerEnd)
    }
  }, [dragSessionId, clampThumbLeft, endDragSession])

  const sizeClass = size === 'md' ? '' : ` switch-liquid-glass--${size}`

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      trackRef.current = node
      hostRef.current = node
    },
    [hostRef],
  )

  return (
    <>
      <LiquidGlassFilter
        filterId={filterId}
        mapId={mapId}
        mapUrl={mapUrl}
        width={filterSize.width}
        height={filterSize.height}
      />
      <button
        ref={setRefs}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`switch-liquid-glass${sizeClass}${checked ? ' switch-liquid-glass--checked' : ''}${isDragging ? ' switch-liquid-glass--dragging' : ''}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        onPointerDown={handlePointerDown}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented || ignoreClickRef.current) return
          toggle()
        }}
        onLostPointerCapture={() => {
          if (dragStateRef.current) endDragSession()
        }}
        {...props}
      >
        <span
          className={`switch-liquid-glass__thumb${isDragging ? ' switch-liquid-glass__thumb--dragging' : ''}`}
          aria-hidden
          style={{
            width: thumbWidth,
            height: thumbHeight,
            transform: `translate3d(${thumbLeft}px, ${THUMB_INSET}px, 0)`,
            borderRadius:
              thumbRadius >= PILL_BORDER_RADIUS ? '999px' : `${thumbRadius}px`,
          }}
        />
      </button>
    </>
  )
}

export default SwitchLiquidGlass
