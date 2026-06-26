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
  label: string
  category: 'default' | 'slider'
  defaultValue: string
  items: { value: string; label: string }[]
  size?: 'sm' | 'md' | 'lg'
  glassParams?: LiquidGlassParams
  thumbGlassParams?: LiquidGlassParams
  variant?: 'default' | 'slider'
}

const DEMO_BUTTON_GROUPS: DemoButtonGroup[] = [
  // —— default：项内选中高亮 ——
  {
    name: 'period',
    label: 'Default · md',
    category: 'default',
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
    label: 'Binary · md',
    category: 'default',
    defaultValue: 'grid',
    items: [
      { value: 'grid', label: 'Grid' },
      { value: 'list', label: 'List' },
    ],
  },
  {
    name: 'align',
    label: 'Three-way · md',
    category: 'default',
    defaultValue: 'center',
    items: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
  },
  {
    name: 'sort',
    label: 'Small · sm',
    category: 'default',
    defaultValue: 'newest',
    size: 'sm',
    items: [
      { value: 'newest', label: 'Newest' },
      { value: 'popular', label: 'Popular' },
      { value: 'trending', label: 'Trending' },
    ],
  },
  {
    name: 'status',
    label: 'Large · lg',
    category: 'default',
    defaultValue: 'all',
    size: 'lg',
    items: [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'archived', label: 'Archived' },
    ],
  },
  {
    name: 'pill-default',
    label: 'Pill · default',
    category: 'default',
    defaultValue: 'on',
    glassParams: { borderRadius: 999, strength: 1, edgeFalloff: 12 },
    items: [
      { value: 'on', label: 'On' },
      { value: 'off', label: 'Off' },
    ],
  },
  {
    name: 'sharp-default',
    label: 'Sharp · r4',
    category: 'default',
    defaultValue: 'code',
    glassParams: { borderRadius: 4, strength: 1.15, edgeFalloff: 10 },
    items: [
      { value: 'code', label: 'Code' },
      { value: 'preview', label: 'Preview' },
    ],
  },
  {
    name: 'soft-default',
    label: 'Soft · r16',
    category: 'default',
    defaultValue: 'photos',
    glassParams: { borderRadius: 16, strength: 0.85, edgeFalloff: 16 },
    items: [
      { value: 'photos', label: 'Photos' },
      { value: 'albums', label: 'Albums' },
      { value: 'shared', label: 'Shared' },
    ],
  },
  {
    name: 'strong-default',
    label: 'Strong lens',
    category: 'default',
    defaultValue: 'bold',
    glassParams: { strength: 1.45, edgeFalloff: 20 },
    items: [
      { value: 'regular', label: 'Regular' },
      { value: 'bold', label: 'Bold' },
      { value: 'italic', label: 'Italic' },
    ],
  },
  {
    name: 'subtle-default',
    label: 'Subtle glass',
    category: 'default',
    defaultValue: 'low',
    glassParams: { strength: 0.45, edgeFalloff: 7 },
    items: [
      { value: 'low', label: 'Low' },
      { value: 'mid', label: 'Mid' },
      { value: 'high', label: 'High' },
    ],
  },
  {
    name: 'unit',
    label: 'Compact · sm',
    category: 'default',
    defaultValue: 'metric',
    size: 'sm',
    items: [
      { value: 'metric', label: 'Metric' },
      { value: 'imperial', label: 'Imperial' },
    ],
  },

  // —— slider：滑动玻璃指示器 + 拖拽 ——
  {
    name: 'theme',
    label: 'Slider · pill icons',
    category: 'slider',
    variant: 'slider',
    defaultValue: 'dark',
    glassParams: { borderRadius: 999, strength: 1, edgeFalloff: 12 },
    items: [
      { value: 'light', label: '☀' },
      { value: 'dark', label: '☾' },
      { value: 'system', label: '◐' },
    ],
  },
  {
    name: 'slider-period',
    label: 'Slider · 4 segments',
    category: 'slider',
    variant: 'slider',
    defaultValue: 'week',
    items: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
      { value: 'year', label: 'Year' },
    ],
  },
  {
    name: 'slider-binary',
    label: 'Slider · pill binary',
    category: 'slider',
    variant: 'slider',
    defaultValue: 'yes',
    glassParams: { borderRadius: 999, strength: 1.1, edgeFalloff: 14 },
    items: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    name: 'slider-lang',
    label: 'Slider · language',
    category: 'slider',
    variant: 'slider',
    defaultValue: 'en',
    size: 'sm',
    glassParams: { borderRadius: 999, strength: 0.95, edgeFalloff: 10 },
    items: [
      { value: 'en', label: 'EN' },
      { value: 'zh', label: '中' },
      { value: 'jp', label: 'JP' },
    ],
  },
  {
    name: 'slider-align',
    label: 'Slider · three-way',
    category: 'slider',
    variant: 'slider',
    defaultValue: 'center',
    glassParams: { borderRadius: 10, strength: 1.05, edgeFalloff: 14 },
    items: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
  },
  {
    name: 'slider-strong',
    label: 'Slider · strong lens',
    category: 'slider',
    variant: 'slider',
    defaultValue: '1x',
    glassParams: { borderRadius: 999, strength: 1.5, edgeFalloff: 22 },
    thumbGlassParams: { strength: 1.35 },
    items: [
      { value: '0.5x', label: '0.5×' },
      { value: '1x', label: '1×' },
      { value: '2x', label: '2×' },
    ],
  },
  {
    name: 'slider-subtle',
    label: 'Slider · subtle',
    category: 'slider',
    variant: 'slider',
    defaultValue: 'mid',
    glassParams: { borderRadius: 8, strength: 0.4, edgeFalloff: 6 },
    items: [
      { value: 'low', label: 'Low' },
      { value: 'mid', label: 'Mid' },
      { value: 'high', label: 'High' },
    ],
  },
  {
    name: 'slider-soft',
    label: 'Slider · soft r16',
    category: 'slider',
    variant: 'slider',
    defaultValue: 'design',
    glassParams: { borderRadius: 16, strength: 0.9, edgeFalloff: 16 },
    items: [
      { value: 'design', label: 'Design' },
      { value: 'dev', label: 'Dev' },
      { value: 'qa', label: 'QA' },
    ],
  },
  {
    name: 'slider-sharp',
    label: 'Slider · sharp r4',
    category: 'slider',
    variant: 'slider',
    defaultValue: 'edit',
    glassParams: { borderRadius: 4, strength: 1.2, edgeFalloff: 8 },
    items: [
      { value: 'edit', label: 'Edit' },
      { value: 'view', label: 'View' },
    ],
  },
  {
    name: 'slider-lg',
    label: 'Slider · large pill',
    category: 'slider',
    variant: 'slider',
    defaultValue: 'monthly',
    size: 'lg',
    glassParams: { borderRadius: 999, strength: 1, edgeFalloff: 18 },
    items: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
    ],
  },
  {
    name: 'slider-transport',
    label: 'Slider · 5 options',
    category: 'slider',
    variant: 'slider',
    defaultValue: 'bus',
    size: 'sm',
    glassParams: { borderRadius: 999, strength: 1.05, edgeFalloff: 11 },
    items: [
      { value: 'walk', label: '🚶' },
      { value: 'bike', label: '🚲' },
      { value: 'bus', label: '🚌' },
      { value: 'car', label: '🚗' },
      { value: 'fly', label: '✈' },
    ],
  },
]

const INITIAL_GROUP_VALUES = Object.fromEntries(
  DEMO_BUTTON_GROUPS.map(({ name, defaultValue }) => [name, defaultValue]),
)

function renderButtonGroup(
  demo: DemoButtonGroup,
  value: string,
  onChange: (value: string) => void,
) {
  const group =
    demo.variant === 'slider' ? (
      <LiquidGlassButtonGroup
        key={demo.name}
        name={demo.name}
        size={demo.size}
        variant="slider"
        glassParams={demo.glassParams}
        thumbGlassParams={demo.thumbGlassParams}
        value={value}
        onValueChange={onChange}
      >
        {demo.items.map(({ value: itemValue, label }) => (
          <LiquidGlassButtonGroup.Item key={itemValue} value={itemValue}>
            {label}
          </LiquidGlassButtonGroup.Item>
        ))}
      </LiquidGlassButtonGroup>
    ) : (
      <LiquidGlassButtonGroup
        key={demo.name}
        name={demo.name}
        size={demo.size}
        glassParams={demo.glassParams}
        value={value}
        onValueChange={onChange}
      >
        {demo.items.map(({ value: itemValue, label }) => (
          <LiquidGlassButtonGroup.Item key={itemValue} value={itemValue}>
            {label}
          </LiquidGlassButtonGroup.Item>
        ))}
      </LiquidGlassButtonGroup>
    )

  return (
    <div key={demo.name} className="app__group-demo">
      {group}
      <span className="app__group-label">{demo.label}</span>
    </div>
  )
}

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

        <div className="app__group-block">
          <h3 className="app__group-block-title">default · 项内选中高亮</h3>
          <p className="app__section-hint">默认变体，点击切换，支持 sm / md / lg 与多种 glassParams</p>
          <div className="app__group-grid">
            {DEMO_BUTTON_GROUPS.filter((d) => d.category === 'default').map((demo) =>
              renderButtonGroup(
                demo,
                groupValues[demo.name],
                (value) => setGroupValue(demo.name, value),
              ),
            )}
          </div>
        </div>

        <div className="app__group-block">
          <h3 className="app__group-block-title">slider · 滑动玻璃指示器</h3>
          <p className="app__section-hint">variant=&quot;slider&quot;，点击切换带动画，按住拖拽后松手吸附</p>
          <div className="app__group-grid">
            {DEMO_BUTTON_GROUPS.filter((d) => d.category === 'slider').map((demo) =>
              renderButtonGroup(
                demo,
                groupValues[demo.name],
                (value) => setGroupValue(demo.name, value),
              ),
            )}
          </div>
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
