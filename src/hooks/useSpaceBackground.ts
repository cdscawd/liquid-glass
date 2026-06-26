import { useEffect, useRef } from 'react'
import { SpaceBackgroundEngine } from '../engine/SpaceBackgroundEngine.js'

export function useSpaceBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const engine = new SpaceBackgroundEngine(container)
    engine.load()

    return () => engine.dispose()
  }, [])

  return containerRef
}
