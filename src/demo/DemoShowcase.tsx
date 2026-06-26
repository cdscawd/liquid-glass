import { useCallback, useEffect, useRef, useState } from 'react'
import { CyberspaceBackground } from '../components/CyberspaceBackground'
import { LiquidGlassProvider } from '../lib/liquid-glass'
import type { LiquidGlassParams } from '../lib/liquid-glass'
import {
  BadgeSection,
  ButtonGroupSection,
  ButtonSection,
  CardSection,
  DataDisplaySection,
  DataEntrySection,
  FeedbackSection,
  FormSection,
  LayoutSection,
  ListSection,
  NavMoreSection,
  NavigationSection,
  OverlaySection,
  TabsSection,
  ThemeSection,
} from './DemoSections'
import { DemoSidebar } from './DemoSidebar'
import { DEMO_NAV_ITEMS } from './demoNav'
import './DemoShowcase.scss'

export function DemoShowcase() {
  const [activeId, setActiveId] = useState(DEMO_NAV_ITEMS[0]?.id ?? 'theme')
  const [globalGlass, setGlobalGlass] = useState<LiquidGlassParams>({
    borderRadius: 8,
    strength: 1,
    edgeFalloff: 14,
  })
  const mainRef = useRef<HTMLElement>(null)
  const scrollLockRef = useRef(false)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    scrollLockRef.current = true
    setActiveId(id)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => {
      scrollLockRef.current = false
    }, 600)
  }, [])

  useEffect(() => {
    const sections = DEMO_NAV_ITEMS.map(({ id }) =>
      document.getElementById(id),
    ).filter(Boolean) as HTMLElement[]

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollLockRef.current) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible[0]
        if (top?.target.id) setActiveId(top.target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <CyberspaceBackground />
      <LiquidGlassProvider glassParams={globalGlass}>
        <div className="demo-showcase">
          <DemoSidebar activeId={activeId} onNavigate={scrollToSection} />
          <main ref={mainRef} className="demo-showcase__main">
            <header className="demo-showcase__hero">
              <h1 className="demo-showcase__title">Liquid Glass Components</h1>
              <p className="demo-showcase__subtitle">
                各组件不同 glassParams 配置 · 展开查看代码 · 左侧菜单快速定位
              </p>
            </header>

            <ThemeSection globalGlass={globalGlass} onThemeChange={setGlobalGlass} />
            <ButtonSection />
            <ButtonGroupSection />
            <BadgeSection />
            <FormSection />
            <DataEntrySection />
            <CardSection />
            <TabsSection />
            <ListSection />
            <DataDisplaySection />
            <LayoutSection />
            <NavigationSection />
            <NavMoreSection />
            <OverlaySection />
            <FeedbackSection />

            <footer className="demo-showcase__footer">
              赛博隧道 Three.js 背景 · 玻璃折射建议在 Chrome 查看
            </footer>
          </main>
        </div>
      </LiquidGlassProvider>
    </>
  )
}

export default DemoShowcase
