import { type RefObject, useCallback, useEffect, useState } from 'react'

export type AnchorFollowPosition = {
  top: number
  left: number
  width?: number
}

export type AnchorFollowMeasure = (rect: DOMRect) => AnchorFollowPosition

export function useAnchorFollowPosition(
  anchorRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  measure: AnchorFollowMeasure,
): AnchorFollowPosition {
  const [position, setPosition] = useState<AnchorFollowPosition>({ top: 0, left: 0 })

  const updatePosition = useCallback(() => {
    const el = anchorRef.current
    if (!el) return
    setPosition(measure(el.getBoundingClientRect()))
  }, [anchorRef, measure])

  useEffect(() => {
    if (!enabled) return
    updatePosition()
    const onChange = () => updatePosition()
    window.addEventListener('scroll', onChange, true)
    window.addEventListener('resize', onChange)
    return () => {
      window.removeEventListener('scroll', onChange, true)
      window.removeEventListener('resize', onChange)
    }
  }, [enabled, updatePosition])

  return position
}
