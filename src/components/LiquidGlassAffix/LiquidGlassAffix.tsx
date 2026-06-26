import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import './LiquidGlassAffix.scss'

export interface LiquidGlassAffixProps extends HTMLAttributes<HTMLDivElement> {
  offsetTop?: number
  offsetBottom?: number
  target?: () => HTMLElement | Window | null
  children: ReactNode
}

export function LiquidGlassAffix({
  offsetTop = 0,
  offsetBottom,
  target,
  className = '',
  style,
  children,
  ...props
}: LiquidGlassAffixProps) {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const [affixed, setAffixed] = useState(false)
  const [affixStyle, setAffixStyle] = useState<CSSProperties>({})

  useEffect(() => {
    const scrollTarget = target?.() ?? window
    if (!scrollTarget || !placeholderRef.current) return

    const onScroll = () => {
      const el = placeholderRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()

      if (offsetBottom != null) {
        const viewportHeight =
          scrollTarget === window ? window.innerHeight : (scrollTarget as HTMLElement).clientHeight
        const shouldAffix = rect.bottom > viewportHeight - offsetBottom
        setAffixed(shouldAffix)
        if (shouldAffix) {
          setAffixStyle({
            position: 'fixed',
            bottom: offsetBottom,
            width: rect.width,
            left: rect.left,
          })
        } else {
          setAffixStyle({})
        }
        return
      }

      const shouldAffix = rect.top <= offsetTop
      setAffixed(shouldAffix)
      if (shouldAffix) {
        setAffixStyle({
          position: 'fixed',
          top: offsetTop,
          width: rect.width,
          left: rect.left,
        })
      } else {
        setAffixStyle({})
      }
    }

    scrollTarget.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()

    return () => {
      scrollTarget.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [offsetTop, offsetBottom, target])

  return (
    <div ref={placeholderRef} className={`liquid-glass-affix${className ? ` ${className}` : ''}`} style={style} {...props}>
      <div
        className={`liquid-glass-affix__content${affixed ? ' liquid-glass-affix__content--fixed' : ''}`}
        style={affixStyle}
      >
        {children}
      </div>
    </div>
  )
}

export default LiquidGlassAffix
