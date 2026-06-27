import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react'
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_THUMB_STRENGTH,
  LiquidGlassFilter,
  PILL_BORDER_RADIUS,
  useLiquidGlassEffect,
  type LiquidGlassFilterMode,
  type LiquidGlassNestedPolicy,
  type LiquidGlassParams,
} from '../../lib/liquid-glass'
import './ButtonGroupLiquidGlass.scss'

export type ButtonGroupLiquidGlassSize = 'sm' | 'md' | 'lg'
export type ButtonGroupLiquidGlassVariant = 'default' | 'slider'

const THUMB_INSET = 3
const DRAG_THRESHOLD = 4

interface ItemLayout {
  value: string
  disabled: boolean
  left: number
  top: number
  width: number
  height: number
}

interface ButtonGroupLiquidGlassBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
  size?: ButtonGroupLiquidGlassSize
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  children: ReactNode
}

export interface ButtonGroupLiquidGlassDefaultProps
  extends ButtonGroupLiquidGlassBaseProps {
  variant?: 'default'
  thumbGlassParams?: never
}

export interface ButtonGroupSliderLiquidGlassProps
  extends ButtonGroupLiquidGlassBaseProps {
  variant: 'slider'
  thumbGlassParams?: LiquidGlassParams
}

export type ButtonGroupLiquidGlassProps =
  | ButtonGroupLiquidGlassDefaultProps
  | ButtonGroupSliderLiquidGlassProps

interface ButtonGroupContextValue {
  value: string | undefined
  name?: string
  size: ButtonGroupLiquidGlassSize
  isDragging: boolean
  ignoreClickRef: RefObject<boolean>
  select: (value: string) => void
}

const noopIgnoreClickRef = { current: false }

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null)

function useButtonGroupContext(component: string) {
  const ctx = useContext(ButtonGroupContext)
  if (!ctx) {
    throw new Error(`${component} must be used within ButtonGroupLiquidGlass`)
  }
  return ctx
}

export interface ButtonGroupLiquidGlassItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function ButtonGroupLiquidGlassItem({
  value,
  className = '',
  disabled,
  children,
  onClick,
  ...props
}: ButtonGroupLiquidGlassItemProps) {
  const {
    value: selectedValue, name, size, isDragging, ignoreClickRef, select } =
    useButtonGroupContext('ButtonGroupLiquidGlass.Item')
  const selected = selectedValue === value
  const sizeClass =
    size === 'md' ? '' : ` button-group-liquid-glass__item--${size}`

  return (
    <button
      type="button"
      role="radio"
      name={name}
      value={value}
      data-lg-group-item={value}
      data-lg-group-disabled={disabled ? 'true' : undefined}
      aria-checked={selected}
      disabled={disabled}
      className={`button-group-liquid-glass__item${selected ? ' button-group-liquid-glass__item--selected' : ''}${sizeClass}${className ? ` ${className}` : ''}`}
      onClick={(event) => {
        onClick?.(event)
        if (
          event.defaultPrevented ||
          disabled ||
          isDragging ||
          ignoreClickRef.current
        ) {
          return
        }
        select(value)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function getThumbRadius(borderRadius: number, height: number): number {
  if (borderRadius >= PILL_BORDER_RADIUS || borderRadius >= height / 2) {
    return PILL_BORDER_RADIUS
  }
  return Math.max(0, borderRadius - THUMB_INSET)
}

function findNearestItem(items: ItemLayout[], centerX: number): ItemLayout | undefined {
  const enabled = items.filter((item) => !item.disabled)
  if (enabled.length === 0) return undefined

  return enabled.reduce((nearest, item) => {
    const itemCenter = item.left + item.width / 2
    const nearestCenter = nearest.left + nearest.width / 2
    return Math.abs(itemCenter - centerX) < Math.abs(nearestCenter - centerX)
      ? item
      : nearest
  })
}

function getThumbRect(layout: ItemLayout) {
  return {
    left: layout.left + THUMB_INSET,
    top: layout.top + THUMB_INSET,
    width: Math.max(layout.width - THUMB_INSET * 2, 0),
    height: Math.max(layout.height - THUMB_INSET * 2, 0),
  }
}

function useGroupValue(
  valueProp: string | undefined,
  defaultValue: string | undefined,
  onValueChange?: (value: string) => void,
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  const select = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  return { value, select }
}

function ButtonGroupLiquidGlassDefault({
  glassParams,
  filterMode,
  nestedPolicy,
  size = 'md',
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  className = '',
  style,
  children,
  ...props
}: ButtonGroupLiquidGlassDefaultProps) {
  const { value, select } = useGroupValue(valueProp, defaultValue, onValueChange)

  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      filterMode,
      nestedPolicy,
    })

  const sizeClass = size === 'md' ? '' : ` button-group-liquid-glass--${size}`

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
        role="radiogroup"
        aria-label={name}
        className={`button-group-liquid-glass button-group-liquid-glass--default${sizeClass}${className ? ` ${className}` : ''}`}
        style={{
          ...filterStyle,
          borderRadius,
          ...style,
        }}
        {...props}
      >
        <ButtonGroupContext.Provider
          value={{
            value,
            name,
            size,
            isDragging: false,
            ignoreClickRef: noopIgnoreClickRef,
            select,
          }}
        >
          <HostBoundary>{children}</HostBoundary>
        </ButtonGroupContext.Provider>
      </div>
    </>
  )
}

function ButtonGroupSliderLiquidGlass({
  glassParams,
  filterMode,
  nestedPolicy,
  thumbGlassParams,
  size = 'md',
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  className = '',
  style,
  children,
  ...props
}: ButtonGroupSliderLiquidGlassProps) {
  const {
    value, select: baseSelect } = useGroupValue(
    valueProp,
    defaultValue,
    onValueChange,
  )

  const [itemLayouts, setItemLayouts] = useState<ItemLayout[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragSessionId, setDragSessionId] = useState(0)
  const [dragThumb, setDragThumb] = useState<{
    left: number
    top: number
    width: number
    height: number
  } | null>(null)

  const trackRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<{
    pointerId: number
    startX: number
    startThumbLeft: number
    thumbWidth: number
    thumbTop: number
    thumbHeight: number
    didDrag: boolean
    tapItemValue?: string
    lastClientX: number
  } | null>(null)
  const didDragRef = useRef(false)
  const ignoreClickRef = useRef(false)
  const itemLayoutsRef = useRef<ItemLayout[]>([])

  const select = useCallback(
    (next: string) => {
      const layouts = itemLayoutsRef.current
      const target = layouts.find((item) => item.value === next)
      if (target?.disabled) return
      if (target === undefined && layouts.length > 0) return
      baseSelect(next)
    },
    [baseSelect],
  )

  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius,
    isFilterActive,
    HostBoundary,
  } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      filterMode,
      nestedPolicy,
    })

  const activeLayout = itemLayouts.find((item) => item.value === value)
  const activeThumb = activeLayout ? getThumbRect(activeLayout) : null
  const thumbRect = dragThumb ?? activeThumb
  const thumbRadius = getThumbRadius(
    thumbGlassParams?.borderRadius ?? glassParams?.borderRadius ?? DEFAULT_BORDER_RADIUS,
    thumbRect?.height ?? 0,
  )

  const resolvedThumbGlassParams = useMemo(
    (): LiquidGlassParams => ({
      borderRadius: thumbRadius,
      edgeFalloff: thumbGlassParams?.edgeFalloff ?? glassParams?.edgeFalloff,
      strength: thumbGlassParams?.strength ?? glassParams?.strength ?? DEFAULT_THUMB_STRENGTH,
    }),
    [
      glassParams?.edgeFalloff,
      glassParams?.strength,
      thumbGlassParams?.edgeFalloff,
      thumbGlassParams?.strength,
      thumbRadius,
    ],
  )

  const {
    hostRef: thumbRef,
    filterId: thumbFilterId,
    mapId: thumbMapId,
    mapUrl: thumbMapUrl,
    filterSize: thumbFilterSize,
    filterStyle: thumbFilterStyle,
    isFilterActive: isThumbFilterActive,
  } =
    useLiquidGlassEffect<HTMLDivElement>(resolvedThumbGlassParams, {
      filterMode,
      nestedPolicy,
    })

  const measureItems = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const trackRect = track.getBoundingClientRect()
    const buttons = track.querySelectorAll<HTMLButtonElement>('[data-lg-group-item]')

    const layouts = Array.from(buttons).map((button) => {
      const rect = button.getBoundingClientRect()
      return {
        value: button.dataset.lgGroupItem ?? '',
        disabled: button.dataset.lgGroupDisabled === 'true',
        left: rect.left - trackRect.left,
        top: rect.top - trackRect.top,
        width: rect.width,
        height: rect.height,
      }
    })

    setItemLayouts(layouts)
    itemLayoutsRef.current = layouts
  }, [])

  useLayoutEffect(() => {
    measureItems()
    const track = trackRef.current
    const group = hostRef.current
    if (!track || !group) return

    const observer = new ResizeObserver(measureItems)
    observer.observe(group)
    observer.observe(track)
    return () => observer.disconnect()
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [children, measureItems, value, size])

  const clampThumbLeft = useCallback(
    (left: number, width: number) => {
      if (itemLayouts.length === 0) return left
      const first = getThumbRect(itemLayouts[0]!)
      const last = getThumbRect(itemLayouts[itemLayouts.length - 1]!)
      const minLeft = first.left
      const maxLeft = last.left + last.width - width
      return Math.min(Math.max(left, minLeft), maxLeft)
    },
    [itemLayouts],
  )

  const finishDrag = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      const layouts = itemLayoutsRef.current
      if (!track || layouts.length === 0) return

      const trackRect = track.getBoundingClientRect()
      const nearest = findNearestItem(layouts, clientX - trackRect.left)
      if (nearest) select(nearest.value)
    },
    [select],
  )

  const endDragSession = useCallback(
    (clientX?: number) => {
      const dragState = dragStateRef.current
      const track = trackRef.current

      if (!dragState) {
        setIsDragging(false)
        setDragThumb(null)
        return
      }

      const resolvedClientX = clientX ?? dragState.lastClientX

      if (track?.hasPointerCapture(dragState.pointerId)) {
        track.releasePointerCapture(dragState.pointerId)
      }

      if (resolvedClientX !== undefined) {
        if (dragState.didDrag) {
          finishDrag(resolvedClientX)
        } else if (dragState.tapItemValue) {
          select(dragState.tapItemValue)
        } else {
          const trackRect = track!.getBoundingClientRect()
          const layouts = itemLayoutsRef.current
          const target = findNearestItem(layouts, resolvedClientX - trackRect.left)
          if (target) select(target.value)
        }
      }

      const wasDrag = dragState.didDrag
      dragStateRef.current = null
      setIsDragging(false)
      setDragThumb(null)

      if (wasDrag) {
        didDragRef.current = true
        ignoreClickRef.current = true
        window.setTimeout(() => {
          didDragRef.current = false
          ignoreClickRef.current = false
        }, 0)
      } else {
        didDragRef.current = false
        ignoreClickRef.current = true
        window.setTimeout(() => {
          ignoreClickRef.current = false
        }, 0)
      }
    },
    [finishDrag, select],
  )

  const handleTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !activeThumb || dragStateRef.current) return

    const itemEl = (event.target as HTMLElement).closest<HTMLButtonElement>(
      '[data-lg-group-item]',
    )

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startThumbLeft: activeThumb.left,
      thumbWidth: activeThumb.width,
      thumbTop: activeThumb.top,
      thumbHeight: activeThumb.height,
      didDrag: false,
      tapItemValue: itemEl?.dataset.lgGroupItem,
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

      setDragThumb({
        left: clampThumbLeft(state.startThumbLeft + deltaX, state.thumbWidth),
        top: state.thumbTop,
        width: state.thumbWidth,
        height: state.thumbHeight,
      })
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

  const sizeClass = size === 'md' ? '' : ` button-group-liquid-glass--${size}`

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
      {thumbRect && isThumbFilterActive && (
        <LiquidGlassFilter
          filterId={thumbFilterId}
          mapId={thumbMapId}
          mapUrl={thumbMapUrl}
          width={thumbFilterSize.width}
          height={thumbFilterSize.height}
        />
      )}
      <div
        ref={hostRef}
        role="radiogroup"
        aria-label={name}
        className={`button-group-liquid-glass button-group-liquid-glass--slider${sizeClass}${className ? ` ${className}` : ''}`}
        style={{
          ...filterStyle,
          borderRadius,
          ...style,
        }}
        {...props}
      >
        <div
          ref={trackRef}
          className={`button-group-liquid-glass__track${isDragging ? ' button-group-liquid-glass__track--dragging' : ''}`}
          onPointerDown={handleTrackPointerDown}
          onLostPointerCapture={() => {
            if (dragStateRef.current) endDragSession()
          }}
        >
          {thumbRect && (
            <div
              ref={thumbRef}
              className={`button-group-liquid-glass__thumb${isDragging ? ' button-group-liquid-glass__thumb--dragging' : ''}`}
              aria-hidden
              style={{
                ...thumbFilterStyle,
                width: thumbRect.width,
                height: thumbRect.height,
                transform: `translate3d(${thumbRect.left}px, ${thumbRect.top}px, 0)`,
                borderRadius: thumbRadius >= PILL_BORDER_RADIUS ? '999px' : `${thumbRadius}px`,
              }}
            />
          )}
          <ButtonGroupContext.Provider
            value={{ value, name, size, isDragging, ignoreClickRef, select }}
          >
            <HostBoundary>{children}</HostBoundary>
          </ButtonGroupContext.Provider>
        </div>
      </div>
    </>
  )
}

export function ButtonGroupLiquidGlass(props: ButtonGroupLiquidGlassProps) {
  if (props.variant === 'slider') {
    return <ButtonGroupSliderLiquidGlass {...props} />
  }
  return <ButtonGroupLiquidGlassDefault {...props} variant="default" />
}

ButtonGroupLiquidGlass.Item = ButtonGroupLiquidGlassItem

export default ButtonGroupLiquidGlass
