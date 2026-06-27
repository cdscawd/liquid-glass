import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'

export type FloatingPlacement = 'bottom' | 'top'
export type FloatingAlign = 'center' | 'start' | 'end'

export interface UseFloatingPositionOptions {
  enabled: boolean
  triggerRef: RefObject<HTMLElement | null>
  floatingRef?: RefObject<HTMLElement | null>
  placement?: FloatingPlacement
  align?: FloatingAlign
  offset?: number
  matchTriggerWidth?: boolean
}

export function useFloatingPosition({
  enabled,
  triggerRef,
  floatingRef,
  placement = 'bottom',
  align = 'center',
  offset = 8,
  matchTriggerWidth = false,
}: UseFloatingPositionOptions): CSSProperties | undefined {
  const [style, setStyle] = useState<CSSProperties>()
  const rafRef = useRef<number | null>(null)

  const update = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger || !enabled) return

    const rect = trigger.getBoundingClientRect()
    const floating = floatingRef?.current
    const floatingHeight = floating?.offsetHeight ?? 0
    const floatingWidth = floating?.offsetWidth ?? 0

    let top =
      placement === 'bottom'
        ? rect.bottom + offset
        : rect.top - offset - (floatingHeight || 0)

    let left = rect.left
    let transform: string | undefined

    if (align === 'center') {
      left = rect.left + rect.width / 2
      transform =
        placement === 'top' ? 'translate(-50%, -100%)' : 'translateX(-50%)'
    } else if (align === 'end') {
      left = rect.right
      transform = placement === 'top' ? 'translate(-100%, -100%)' : 'translateX(-100%)'
    } else if (placement === 'top') {
      transform = 'translateY(-100%)'
    }

    const next: CSSProperties = {
      position: 'fixed',
      top,
      left,
      transform,
    }

    if (matchTriggerWidth) {
      next.width = rect.width
      next.minWidth = rect.width
    }

    if (floatingWidth > 0 && align === 'center') {
      const margin = 8
      const half = floatingWidth / 2
      left = Math.min(
        Math.max(left, margin + half),
        window.innerWidth - margin - half,
      )
      next.left = left
    }

    setStyle(next)
  }, [align, enabled, floatingRef, matchTriggerWidth, offset, placement, triggerRef])

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      update()
    })
  }, [update])

  useLayoutEffect(() => {
    if (!enabled) {
      setStyle(undefined)
      return
    }
    scheduleUpdate()
  }, [enabled, scheduleUpdate])

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('scroll', scheduleUpdate, true)
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate, true)
      window.removeEventListener('resize', scheduleUpdate)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [enabled, scheduleUpdate])

  useEffect(() => {
    const floating = floatingRef?.current
    if (!enabled || !floating) return

    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(floating)
    return () => observer.disconnect()
  }, [enabled, floatingRef, scheduleUpdate])

  return style
}
