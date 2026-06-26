import { useSpaceBackground } from '../../hooks/useSpaceBackground'
import './CyberspaceBackground.scss'

export function CyberspaceBackground() {
  const containerRef = useSpaceBackground()

  return (
    <div
      ref={containerRef}
      className="cyberspace-background"
      aria-hidden
    />
  )
}

export default CyberspaceBackground
