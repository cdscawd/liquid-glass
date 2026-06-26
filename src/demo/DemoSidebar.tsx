import {
  LiquidGlassAvatar,
  LiquidGlassBadge,
  LiquidGlassCard,
  LiquidGlassDivider,
  LiquidGlassList,
} from '../components'
import { DEMO_NAV } from './demoNav'
import './DemoSidebar.scss'

interface DemoSidebarProps {
  activeId: string
  onNavigate: (id: string) => void
}

export function DemoSidebar({ activeId, onNavigate }: DemoSidebarProps) {
  return (
    <LiquidGlassCard
      className="demo-sidebar"
      size="sm"
      glassParams={{ borderRadius: 12, strength: 0.85, edgeFalloff: 14 }}
    >
      <div className="demo-sidebar__brand">
        <LiquidGlassAvatar fallback="LG" size="sm" />
        <div className="demo-sidebar__brand-text">
          <div className="demo-sidebar__title">Liquid Glass</div>
          <LiquidGlassBadge variant="chip" size="sm">
            Showcase
          </LiquidGlassBadge>
        </div>
      </div>

      <LiquidGlassDivider
        orientation="horizontal"
        className="demo-sidebar__divider"
        glassParams={{ borderRadius: 999, strength: 0.5, edgeFalloff: 6 }}
      />

      <nav className="demo-sidebar__nav" aria-label="组件导航">
        {DEMO_NAV.map((group) => (
          <div key={group.title} className="demo-sidebar__group">
            <div className="demo-sidebar__group-title">{group.title}</div>
            <LiquidGlassList
              className="demo-sidebar__list"
              glassParams={{ borderRadius: 8, strength: 0.75, edgeFalloff: 10 }}
              items={group.items.map((item) => ({
                id: item.id,
                title: item.label,
                selected: activeId === item.id,
                onClick: () => onNavigate(item.id),
              }))}
            />
          </div>
        ))}
      </nav>
    </LiquidGlassCard>
  )
}
