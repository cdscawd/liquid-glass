import { useState } from 'react'
import { LiquidGlassButton } from './components/LiquidGlassButton'
import { LiquidGlassButtonGroup } from './components/LiquidGlassButtonGroup'
import type { LiquidGlassParams } from './lib/liquid-glass'
import './App.scss'

interface DemoButton {
  label: string
  size?: 'sm' | 'md' | 'lg'
  glassParams?: LiquidGlassParams
}

const DEMO_BUTTONS: DemoButton[] = [
  { label: 'Default', glassParams: {} },
  {
    label: 'Strong Lens',
    glassParams: { strength: 1.45, edgeFalloff: 20 },
  },
  {
    label: 'Subtle Glass',
    glassParams: { strength: 0.45, edgeFalloff: 7 },
  },
  {
    label: 'Wide Edge',
    glassParams: { strength: 1, edgeFalloff: 24 },
  },
  {
    label: 'Narrow Edge',
    glassParams: { strength: 1.2, edgeFalloff: 6 },
  },
  {
    label: 'Sharp Corner',
    glassParams: { borderRadius: 4, strength: 1.15, edgeFalloff: 10 },
  },
  {
    label: 'Pill Shape',
    glassParams: { borderRadius: 999, strength: 1, edgeFalloff: 14 },
  },
  {
    label: 'Soft Round',
    glassParams: { borderRadius: 16, strength: 0.85, edgeFalloff: 16 },
  },
  { label: 'Small', size: 'sm', glassParams: { strength: 1.3, edgeFalloff: 5 } },
  {
    label: 'Large',
    size: 'lg',
    glassParams: { strength: 1.1, edgeFalloff: 18 },
  },
  {
    label: 'Max Distort',
    glassParams: { strength: 1.6, edgeFalloff: 22, borderRadius: 12 },
  },
  {
    label: 'Minimal',
    glassParams: { strength: 0.35, edgeFalloff: 5, borderRadius: 6 },
  },
]

interface DemoButtonGroup {
  name: string
  defaultValue: string
  items: { value: string; label: string }[]
  size?: 'sm' | 'md' | 'lg'
}

const DEMO_BUTTON_GROUPS: DemoButtonGroup[] = [
  {
    name: 'period',
    defaultValue: 'week',
    items: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
      { value: 'year', label: 'Year' },
    ],
  },
  {
    name: 'view',
    defaultValue: 'grid',
    items: [
      { value: 'grid', label: 'Grid' },
      { value: 'list', label: 'List' },
    ],
  },
  {
    name: 'align',
    defaultValue: 'center',
    items: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
  },
  {
    name: 'sort',
    defaultValue: 'newest',
    size: 'sm',
    items: [
      { value: 'newest', label: 'Newest' },
      { value: 'popular', label: 'Popular' },
      { value: 'trending', label: 'Trending' },
    ],
  },
  {
    name: 'theme',
    defaultValue: 'system',
    items: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' },
    ],
  },
  {
    name: 'unit',
    defaultValue: 'metric',
    size: 'sm',
    items: [
      { value: 'metric', label: 'Metric' },
      { value: 'imperial', label: 'Imperial' },
    ],
  },
  {
    name: 'status',
    defaultValue: 'all',
    size: 'lg',
    items: [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'archived', label: 'Archived' },
    ],
  },
]

const INITIAL_GROUP_VALUES = Object.fromEntries(
  DEMO_BUTTON_GROUPS.map(({ name, defaultValue }) => [name, defaultValue]),
)

function App() {
  const [groupValues, setGroupValues] = useState(INITIAL_GROUP_VALUES)

  const setGroupValue = (name: string, value: string) => {
    setGroupValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <main className="app">
      <h1 className="app__title">Liquid Glass Components</h1>

      <section className="app__section">
        <h2 className="app__section-title">Button Group</h2>
        <div className="app__row">
          {DEMO_BUTTON_GROUPS.map(({ name, items, size }) => (
            <LiquidGlassButtonGroup
              key={name}
              name={name}
              size={size}
              value={groupValues[name]}
              onValueChange={(value) => setGroupValue(name, value)}
            >
              {items.map(({ value, label }) => (
                <LiquidGlassButtonGroup.Item key={value} value={value}>
                  {label}
                </LiquidGlassButtonGroup.Item>
              ))}
            </LiquidGlassButtonGroup>
          ))}
        </div>
      </section>

      <section className="app__section">
        <h2 className="app__section-title">Buttons</h2>
        <div className="app__buttons">
          {DEMO_BUTTONS.map(({ label, size, glassParams }) => (
            <LiquidGlassButton key={label} size={size} glassParams={glassParams}>
              {label}
            </LiquidGlassButton>
          ))}
        </div>
      </section>

      <p className="app__hint">
        不同 strength / edgeFalloff / borderRadius 预设，边缘折射强度与形状各异（建议
        Chrome 查看）
      </p>
    </main>
  )
}

export default App
