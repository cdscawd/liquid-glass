import { useEffect, useState, type ReactNode } from 'react'
import {
  LiquidGlassAlert,
  LiquidGlassAvatar,
  LiquidGlassAvatarGroup,
  LiquidGlassBadge,
  LiquidGlassBreadcrumb,
  LiquidGlassButton,
  LiquidGlassButtonGroup,
  LiquidGlassCard,
  LiquidGlassDivider,
  LiquidGlassDock,
  LiquidGlassDrawer,
  LiquidGlassIconButton,
  LiquidGlassInput,
  LiquidGlassList,
  LiquidGlassMediaCard,
  LiquidGlassModal,
  LiquidGlassNavbar,
  LiquidGlassPagination,
  LiquidGlassPopover,
  LiquidGlassProgress,
  LiquidGlassSlider,
  LiquidGlassSwitch,
  LiquidGlassTabs,
  LiquidGlassTextarea,
  LiquidGlassToast,
  LiquidGlassTooltip,
} from '../components'
import type { LiquidGlassParams } from '../lib/liquid-glass'
import { DemoBlock } from './DemoBlock'
import {
  DEMO_BUTTON_GROUPS,
  DEMO_BUTTONS,
  INITIAL_GROUP_VALUES,
  type DemoButtonConfig,
  type DemoButtonGroupConfig,
} from './demoData'
import { FILL_PRESETS, GLASS_PRESETS, PANEL_PRESETS, SIZES, THUMB_PRESETS } from './demoVariants'
import {
  fillPropsLine,
  formatGlassParams,
  glassPropsLine,
  panelPropsLine,
  sizePropLine,
  thumbPropsLine,
} from './formatCode'

const TAB_ITEMS = [
  { value: 'overview', label: 'Overview', content: 'Liquid glass tab panel — Overview content.' },
  { value: 'details', label: 'Details', content: 'Details about refraction and displacement maps.' },
  { value: 'settings', label: 'Settings', content: 'Tune strength, edgeFalloff, and borderRadius.' },
]

const LIST_ITEMS = [
  { id: '1', title: 'Tunnel Shader', description: 'Blue-purple gradient grid lines' },
  { id: '2', title: 'Particle Field', description: 'Mint, amber, and pink spirals' },
  { id: '3', title: 'Glass Thumb', description: 'Slider variant with drag snap' },
  { id: '4', title: 'Disabled Row', description: 'disabled: true', disabled: true },
]

const DOCK_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'search', label: 'Search', icon: '🔍' },
  { id: 'star', label: 'Star', icon: '⭐' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

function buttonCode(demo: DemoButtonConfig): string {
  return `<LiquidGlassButton\n${sizePropLine(demo.size)}${glassPropsLine(demo.glassParams)}>\n  ${demo.label}\n</LiquidGlassButton>`
}

function buttonGroupCode(demo: DemoButtonGroupConfig): string {
  const lines: string[] = ['<LiquidGlassButtonGroup']
  if (demo.variant === 'slider') lines.push('  variant="slider"')
  if (demo.size && demo.size !== 'md') lines.push(`  size="${demo.size}"`)
  lines.push(`  defaultValue="${demo.defaultValue}"`)
  const gp = formatGlassParams(demo.glassParams)
  if (gp) lines.push(`  glassParams={${gp}}`)
  const tgp = formatGlassParams(demo.thumbGlassParams)
  if (tgp) lines.push(`  thumbGlassParams={${tgp}}`)
  lines.push('>')
  demo.items.forEach((item) => {
    lines.push(`  <LiquidGlassButtonGroup.Item value="${item.value}">${item.label}</LiquidGlassButtonGroup.Item>`)
  })
  lines.push('</LiquidGlassButtonGroup>')
  return lines.join('\n')
}

function DemoSection({
  id,
  title,
  hint,
  propsHint,
  children,
}: {
  id: string
  title: string
  hint?: string
  propsHint?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="demo-section" data-demo-section={id}>
      <header className="demo-section__header">
        <h2 className="demo-section__title">{title}</h2>
        {hint && <p className="demo-section__hint">{hint}</p>}
        {propsHint && <p className="demo-section__props">{propsHint}</p>}
      </header>
      <div className="demo-section__blocks">{children}</div>
    </section>
  )
}

interface ThemeSectionProps {
  globalGlass: LiquidGlassParams
  onThemeChange: (params: LiquidGlassParams) => void
}

export function ThemeSection({ globalGlass, onThemeChange }: ThemeSectionProps) {
  return (
    <DemoSection
      id="theme"
      title="Global Theme (Provider)"
      hint="LiquidGlassProvider 注入全局 glassParams，子组件未传 props 时继承"
      propsHint="glassParams: { borderRadius?, strength?, edgeFalloff? }"
    >
      <DemoBlock
        title="Provider 主题预设"
        description="点击切换全局折射参数，观察下方所有组件联动变化"
        code={`<LiquidGlassProvider glassParams={${formatGlassParams(globalGlass) || '{ ... }'}}>
  <App />
</LiquidGlassProvider>`}
      >
        <LiquidGlassButton
          size="sm"
          onClick={() => onThemeChange({ borderRadius: 8, strength: 1, edgeFalloff: 14 })}
        >
          Default
        </LiquidGlassButton>
        <LiquidGlassButton
          size="sm"
          onClick={() => onThemeChange({ borderRadius: 12, strength: 1.35, edgeFalloff: 20 })}
        >
          Strong
        </LiquidGlassButton>
        <LiquidGlassButton
          size="sm"
          onClick={() => onThemeChange({ borderRadius: 999, strength: 0.85, edgeFalloff: 16 })}
        >
          Pill Soft
        </LiquidGlassButton>
      </DemoBlock>

      {GLASS_PRESETS.map((preset) => (
        <DemoBlock
          key={`theme-${preset.id}`}
          title={`glassParams · ${preset.label}`}
          description={preset.description}
          code={`<LiquidGlassButton\n${glassPropsLine(preset.params)}>\n  Preview\n</LiquidGlassButton>`}
        >
          <LiquidGlassButton glassParams={preset.params}>Preview</LiquidGlassButton>
        </DemoBlock>
      ))}
    </DemoSection>
  )
}

export function ButtonSection() {
  return (
    <DemoSection
      id="button"
      title="Button"
      hint="标准按钮 — 支持 size 与 glassParams"
      propsHint="Props: glassParams?, size?: sm | md | lg, disabled?, onClick, …"
    >
      <DemoBlock
        title="size · sm / md / lg"
        description="尺寸预设，影响 padding 与字号"
        code={SIZES.map(
          (s) => `<LiquidGlassButton size="${s}">${s.toUpperCase()}</LiquidGlassButton>`,
        ).join('\n')}
      >
        {SIZES.map((size) => (
          <LiquidGlassButton key={size} size={size}>
            {size.toUpperCase()}
          </LiquidGlassButton>
        ))}
      </DemoBlock>

      <DemoBlock
        title="disabled"
        description="disabled 态降低 opacity，不可点击"
        code={`<LiquidGlassButton disabled>Disabled</LiquidGlassButton>`}
      >
        <LiquidGlassButton disabled>Disabled</LiquidGlassButton>
        <LiquidGlassButton>Enabled</LiquidGlassButton>
      </DemoBlock>

      {DEMO_BUTTONS.map((demo) => (
        <DemoBlock
          key={demo.id}
          title={`glassParams · ${demo.label}`}
          code={buttonCode(demo)}
        >
          <LiquidGlassButton size={demo.size} glassParams={demo.glassParams}>
            {demo.label}
          </LiquidGlassButton>
        </DemoBlock>
      ))}
    </DemoSection>
  )
}

export function ButtonGroupSection() {
  const [groupValues, setGroupValues] = useState(INITIAL_GROUP_VALUES)

  const renderGroup = (demo: DemoButtonGroupConfig) => {
    const value = groupValues[demo.name]
    const onChange = (next: string) =>
      setGroupValues((prev) => ({ ...prev, [demo.name]: next }))

    const items = demo.items.map(({ value: itemValue, label }) => (
      <LiquidGlassButtonGroup.Item key={itemValue} value={itemValue}>
        {label}
      </LiquidGlassButtonGroup.Item>
    ))

    if (demo.variant === 'slider') {
      return (
        <LiquidGlassButtonGroup
          name={demo.name}
          size={demo.size}
          variant="slider"
          glassParams={demo.glassParams}
          thumbGlassParams={demo.thumbGlassParams}
          value={value}
          onValueChange={onChange}
        >
          {items}
        </LiquidGlassButtonGroup>
      )
    }

    return (
      <LiquidGlassButtonGroup
        name={demo.name}
        size={demo.size}
        glassParams={demo.glassParams}
        value={value}
        onValueChange={onChange}
      >
        {items}
      </LiquidGlassButtonGroup>
    )
  }

  const defaultGroups = DEMO_BUTTON_GROUPS.filter((d) => d.category === 'default')
  const sliderGroups = DEMO_BUTTON_GROUPS.filter((d) => d.category === 'slider')

  return (
    <DemoSection
      id="button-group"
      title="Button Group"
      hint="分段控制 — default 项内高亮 · slider 滑动 thumb"
      propsHint="Props: variant?: default | slider, size?, glassParams?, thumbGlassParams? (slider), value?, defaultValue?, onValueChange?, name?"
    >
      <DemoBlock
        title="size · sm / md / lg (slider)"
        description="slider 变体三种尺寸"
        code={`<LiquidGlassButtonGroup variant="slider" size="sm" defaultValue="a">...</LiquidGlassButtonGroup>`}
      >
        {SIZES.map((size) => (
          <LiquidGlassButtonGroup key={size} variant="slider" size={size} defaultValue="a">
            <LiquidGlassButtonGroup.Item value="a">A</LiquidGlassButtonGroup.Item>
            <LiquidGlassButtonGroup.Item value="b">B</LiquidGlassButtonGroup.Item>
          </LiquidGlassButtonGroup>
        ))}
      </DemoBlock>

      {defaultGroups.map((demo) => (
        <DemoBlock
          key={demo.name}
          title={`variant="default" · ${demo.label}`}
          description="点击切换选中项，选中项内嵌高亮"
          code={buttonGroupCode(demo)}
        >
          {renderGroup(demo)}
        </DemoBlock>
      ))}
      {sliderGroups.map((demo) => (
        <DemoBlock
          key={demo.name}
          title={`variant="slider" · ${demo.label}`}
          description="点击或拖拽 thumb 吸附到选项"
          code={buttonGroupCode(demo)}
        >
          {renderGroup(demo)}
        </DemoBlock>
      ))}
    </DemoSection>
  )
}

export function BadgeSection() {
  return (
    <DemoSection
      id="badge"
      title="Badge & Icon"
      hint="Badge / IconButton / Divider"
      propsHint="Badge: variant?: badge | chip, size?, glassParams? · IconButton: size?, glassParams?, aria-label (必填) · Divider: orientation?, glassParams?"
    >
      <DemoBlock
        title='variant · badge / chip'
        description="chip 使用 pill 圆角预设"
        code={`<LiquidGlassBadge variant="badge">Beta</LiquidGlassBadge>\n<LiquidGlassBadge variant="chip">Chip</LiquidGlassBadge>`}
      >
        <LiquidGlassBadge variant="badge">Beta</LiquidGlassBadge>
        <LiquidGlassBadge variant="chip">Chip</LiquidGlassBadge>
      </DemoBlock>

      {SIZES.map((size) => (
        <DemoBlock
          key={`badge-size-${size}`}
          title={`Badge size · ${size}`}
          code={`<LiquidGlassBadge size="${size}">Badge</LiquidGlassBadge>`}
        >
          <LiquidGlassBadge size={size}>Badge</LiquidGlassBadge>
          <LiquidGlassBadge size={size} variant="chip">
            Chip
          </LiquidGlassBadge>
        </DemoBlock>
      ))}

      {GLASS_PRESETS.slice(0, 4).map((preset) => (
        <DemoBlock
          key={`badge-glass-${preset.id}`}
          title={`Badge glassParams · ${preset.label}`}
          code={`<LiquidGlassBadge\n${glassPropsLine(preset.params)}>\n  ${preset.label}\n</LiquidGlassBadge>`}
        >
          <LiquidGlassBadge glassParams={preset.params}>{preset.label}</LiquidGlassBadge>
        </DemoBlock>
      ))}

      {SIZES.map((size) => (
        <DemoBlock
          key={`icon-size-${size}`}
          title={`IconButton size · ${size}`}
          code={`<LiquidGlassIconButton size="${size}" aria-label="Star">⭐</LiquidGlassIconButton>`}
        >
          <LiquidGlassIconButton size={size} aria-label="Star">
            ⭐
          </LiquidGlassIconButton>
          <LiquidGlassIconButton size={size} aria-label="Settings">
            ⚙️
          </LiquidGlassIconButton>
        </DemoBlock>
      ))}

      {GLASS_PRESETS.slice(1, 4).map((preset) => (
        <DemoBlock
          key={`icon-glass-${preset.id}`}
          title={`IconButton glassParams · ${preset.label}`}
          code={`<LiquidGlassIconButton\n${glassPropsLine(preset.params)} aria-label="Star">\n  ⭐\n</LiquidGlassIconButton>`}
        >
          <LiquidGlassIconButton glassParams={preset.params} aria-label="Star">
            ⭐
          </LiquidGlassIconButton>
        </DemoBlock>
      ))}

      <DemoBlock
        title="Divider orientation · horizontal / vertical"
        code={`<LiquidGlassDivider orientation="horizontal" />\n<LiquidGlassDivider orientation="vertical" />`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Left</span>
          <LiquidGlassDivider orientation="vertical" />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Right</span>
        </div>
        <LiquidGlassDivider orientation="horizontal" />
      </DemoBlock>
    </DemoSection>
  )
}

export function FormSection() {
  const [switchOn, setSwitchOn] = useState(true)
  const [sliderValue, setSliderValue] = useState(62)
  const [progressValue] = useState(72)

  return (
    <DemoSection
      id="form"
      title="Form & Controls"
      hint="Input / Textarea / Switch / Slider / Progress"
      propsHint="Switch: thumbGlassParams?, checked?, onCheckedChange? · Progress: fillGlassParams?, value?, max?"
    >
      {SIZES.map((size) => (
        <DemoBlock
          key={`input-size-${size}`}
          title={`Input size · ${size}`}
          code={`<LiquidGlassInput size="${size}" placeholder="Search…" />`}
        >
          <LiquidGlassInput size={size} placeholder={`${size} input`} style={{ minWidth: 180 }} />
        </DemoBlock>
      ))}

      {GLASS_PRESETS.slice(0, 4).map((preset) => (
        <DemoBlock
          key={`input-glass-${preset.id}`}
          title={`Input glassParams · ${preset.label}`}
          code={`<LiquidGlassInput\n${glassPropsLine(preset.params)} placeholder="Search…" />`}
        >
          <LiquidGlassInput
            glassParams={preset.params}
            placeholder={preset.label}
            style={{ minWidth: 180 }}
          />
        </DemoBlock>
      ))}

      <DemoBlock
        title="Input disabled"
        code={`<LiquidGlassInput disabled placeholder="Disabled" />`}
      >
        <LiquidGlassInput disabled placeholder="Disabled" style={{ minWidth: 180 }} />
      </DemoBlock>

      {SIZES.map((size) => (
        <DemoBlock
          key={`textarea-size-${size}`}
          title={`Textarea size · ${size}`}
          code={`<LiquidGlassTextarea size="${size}" rows={2} placeholder="Note…" />`}
        >
          <LiquidGlassTextarea
            size={size}
            rows={2}
            placeholder={`${size} textarea`}
            style={{ minWidth: 220 }}
          />
        </DemoBlock>
      ))}

      {SIZES.map((size) => (
        <DemoBlock
          key={`switch-size-${size}`}
          title={`Switch size · ${size}`}
          code={`<LiquidGlassSwitch size="${size}" checked={checked} onCheckedChange={setChecked} />`}
        >
          <LiquidGlassSwitch size={size} defaultChecked />
        </DemoBlock>
      ))}

      <DemoBlock
        title="Switch checked / unchecked"
        description="点击切换 · 拖拽 thumb 吸附"
        code={`<LiquidGlassSwitch checked={checked} onCheckedChange={setChecked} />`}
      >
        <LiquidGlassSwitch checked={switchOn} onCheckedChange={setSwitchOn} />
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
          {switchOn ? 'ON' : 'OFF'}
        </span>
      </DemoBlock>

      {GLASS_PRESETS.slice(1, 4).map((preset) => (
        <DemoBlock
          key={`switch-glass-${preset.id}`}
          title={`Switch glassParams · ${preset.label}`}
          code={`<LiquidGlassSwitch\n${glassPropsLine(preset.params)} defaultChecked />`}
        >
          <LiquidGlassSwitch glassParams={preset.params} defaultChecked />
        </DemoBlock>
      ))}

      {THUMB_PRESETS.map((preset) => (
        <DemoBlock
          key={`switch-thumb-${preset.id}`}
          title={`Switch thumbGlassParams · ${preset.label}`}
          description="track 玻璃 + thumb 视觉强度"
          code={`<LiquidGlassSwitch\n${thumbPropsLine(preset.params)} defaultChecked />`}
        >
          <LiquidGlassSwitch thumbGlassParams={preset.params} defaultChecked />
        </DemoBlock>
      ))}

      {GLASS_PRESETS.slice(1, 4).map((preset) => (
        <DemoBlock
          key={`slider-glass-${preset.id}`}
          title={`Slider glassParams · ${preset.label}`}
          description="track-only 玻璃，原生 thumb 样式"
          code={`<LiquidGlassSlider\n${glassPropsLine(preset.params)} value={62} />`}
        >
          <LiquidGlassSlider
            glassParams={preset.params}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            style={{ width: 220 }}
          />
        </DemoBlock>
      ))}

      <DemoBlock
        title="Progress value · 25 / 50 / 75 / 100"
        code={`<LiquidGlassProgress value={75} max={100} />`}
      >
        {[25, 50, 75, 100].map((v) => (
          <LiquidGlassProgress key={v} value={v} style={{ width: 180 }} />
        ))}
      </DemoBlock>

      {FILL_PRESETS.map((preset) => (
        <DemoBlock
          key={`progress-fill-${preset.id}`}
          title={`Progress fillGlassParams · ${preset.label}`}
          code={`<LiquidGlassProgress\n  value={72}\n${fillPropsLine(preset.params)}/>`}
        >
          <LiquidGlassProgress
            value={progressValue}
            fillGlassParams={preset.params}
            style={{ width: 220 }}
          />
        </DemoBlock>
      ))}

      {GLASS_PRESETS.slice(1, 3).map((preset) => (
        <DemoBlock
          key={`progress-track-${preset.id}`}
          title={`Progress glassParams (track) · ${preset.label}`}
          code={`<LiquidGlassProgress\n  value={72}\n${glassPropsLine(preset.params)}/>`}
        >
          <LiquidGlassProgress
            value={progressValue}
            glassParams={preset.params}
            style={{ width: 220 }}
          />
        </DemoBlock>
      ))}
    </DemoSection>
  )
}

export function CardSection() {
  return (
    <DemoSection
      id="card"
      title="Card & Media"
      hint="Card 复合组件 · MediaCard 封装"
      propsHint="Card: size?, glassParams?, Header/Body/Footer 子组件 · MediaCard: image?, imageAlt?, title?, description?, footer?, size?"
    >
      {SIZES.map((size) => (
        <DemoBlock
          key={`card-size-${size}`}
          title={`Card size · ${size}`}
          code={`<LiquidGlassCard size="${size}">\n  <LiquidGlassCard.Header>Title</LiquidGlassCard.Header>\n  <LiquidGlassCard.Body>Body</LiquidGlassCard.Body>\n</LiquidGlassCard>`}
        >
          <LiquidGlassCard size={size} style={{ width: 280 }}>
            <LiquidGlassCard.Header>Size {size.toUpperCase()}</LiquidGlassCard.Header>
            <LiquidGlassCard.Body>Card body content.</LiquidGlassCard.Body>
          </LiquidGlassCard>
        </DemoBlock>
      ))}

      {GLASS_PRESETS.slice(0, 4).map((preset) => (
        <DemoBlock
          key={`card-glass-${preset.id}`}
          title={`Card glassParams · ${preset.label}`}
          code={`<LiquidGlassCard\n${glassPropsLine(preset.params)}>\n  ...\n</LiquidGlassCard>`}
        >
          <LiquidGlassCard glassParams={preset.params} style={{ width: 280 }}>
            <LiquidGlassCard.Header>{preset.label}</LiquidGlassCard.Header>
            <LiquidGlassCard.Body>{preset.description}</LiquidGlassCard.Body>
            <LiquidGlassCard.Footer>
              <LiquidGlassButton size="sm">Action</LiquidGlassButton>
            </LiquidGlassCard.Footer>
          </LiquidGlassCard>
        </DemoBlock>
      ))}

      <DemoBlock
        title="MediaCard · 无 image"
        code={`<LiquidGlassMediaCard\n  title="Title"\n  description="Description text"\n  footer={<LiquidGlassBadge variant="chip">New</LiquidGlassBadge>}\n/>`}
      >
        <LiquidGlassMediaCard
          title="No Image"
          description="image prop 可选，不传则仅文字区域"
          footer={<LiquidGlassBadge variant="chip">New</LiquidGlassBadge>}
          style={{ width: 280 }}
        />
      </DemoBlock>

      {SIZES.map((size) => (
        <DemoBlock
          key={`media-size-${size}`}
          title={`MediaCard size · ${size}`}
          code={`<LiquidGlassMediaCard size="${size}" title="Media" description="..." />`}
        >
          <LiquidGlassMediaCard
            size={size}
            title={`Media ${size}`}
            description="size 影响内边距"
            style={{ width: 280 }}
          />
        </DemoBlock>
      ))}

      {GLASS_PRESETS.slice(1, 3).map((preset) => (
        <DemoBlock
          key={`media-glass-${preset.id}`}
          title={`MediaCard glassParams · ${preset.label}`}
          code={`<LiquidGlassMediaCard\n${glassPropsLine(preset.params)} title="Media" />`}
        >
          <LiquidGlassMediaCard
            glassParams={preset.params}
            title={preset.label}
            description={preset.description}
            style={{ width: 280 }}
          />
        </DemoBlock>
      ))}
    </DemoSection>
  )
}

export function TabsSection() {
  const [tabSize, setTabSize] = useState<string>('overview')

  return (
    <DemoSection
      id="tabs"
      title="Tabs"
      hint="内部使用 ButtonGroup slider + 独立 panel 玻璃"
      propsHint="Props: items[], size?, glassParams?, thumbGlassParams?, panelGlassParams?, value?, defaultValue?, onValueChange?"
    >
      {SIZES.map((size) => (
        <DemoBlock
          key={`tabs-size-${size}`}
          title={`Tabs size · ${size}`}
          code={`<LiquidGlassTabs size="${size}" items={items} defaultValue="overview" />`}
        >
          <LiquidGlassTabs items={TAB_ITEMS} size={size} defaultValue="overview" />
        </DemoBlock>
      ))}

      {GLASS_PRESETS.slice(1, 3).map((preset) => (
        <DemoBlock
          key={`tabs-glass-${preset.id}`}
          title={`Tabs glassParams · ${preset.label}`}
          description="Tab 轨道折射"
          code={`<LiquidGlassTabs\n${glassPropsLine(preset.params)} items={items} />`}
        >
          <LiquidGlassTabs items={TAB_ITEMS} glassParams={preset.params} defaultValue="overview" />
        </DemoBlock>
      ))}

      {THUMB_PRESETS.slice(1).map((preset) => (
        <DemoBlock
          key={`tabs-thumb-${preset.id}`}
          title={`Tabs thumbGlassParams · ${preset.label}`}
          code={`<LiquidGlassTabs\n${thumbPropsLine(preset.params)} items={items} />`}
        >
          <LiquidGlassTabs items={TAB_ITEMS} thumbGlassParams={preset.params} defaultValue="overview" />
        </DemoBlock>
      ))}

      {PANEL_PRESETS.map((preset) => (
        <DemoBlock
          key={`tabs-panel-${preset.id}`}
          title={`Tabs panelGlassParams · ${preset.label}`}
          description="Tab 内容面板独立玻璃"
          code={`<LiquidGlassTabs\n${panelPropsLine(preset.params)} items={items} />`}
        >
          <LiquidGlassTabs
            items={TAB_ITEMS}
            panelGlassParams={preset.params}
            defaultValue="overview"
          />
        </DemoBlock>
      ))}

      <DemoBlock
        title="Tabs controlled · value + onValueChange"
        code={`<LiquidGlassTabs\n  items={items}\n  value={value}\n  onValueChange={setValue}\n/>`}
      >
        <LiquidGlassTabs
          items={TAB_ITEMS}
          value={tabSize}
          onValueChange={setTabSize}
        />
      </DemoBlock>
    </DemoSection>
  )
}

export function ListSection() {
  const [listSelected, setListSelected] = useState('1')

  return (
    <DemoSection
      id="list"
      title="List & Avatar"
      hint="List 单容器 1 filter · 行内 selected 高亮"
      propsHint="List item: id, title, description?, selected?, disabled?, onClick? · Avatar: src?, fallback?, size?, glassParams? · AvatarGroup: max?, glassParams?"
    >
      {SIZES.map((size) => (
        <DemoBlock
          key={`avatar-size-${size}`}
          title={`Avatar size · ${size}`}
          code={`<LiquidGlassAvatar size="${size}" fallback="LG" />`}
        >
          <LiquidGlassAvatar size={size} fallback="LG" />
        </DemoBlock>
      ))}

      <DemoBlock
        title="Avatar src / fallback"
        code={`<LiquidGlassAvatar src="/avatar.png" alt="User" />\n<LiquidGlassAvatar fallback="AB" />`}
      >
        <LiquidGlassAvatar fallback="AB" />
        <LiquidGlassAvatar fallback="CD" glassParams={{ strength: 1.3 }} />
      </DemoBlock>

      {[2, 3, 4].map((max) => (
        <DemoBlock
          key={`avatar-group-max-${max}`}
          title={`AvatarGroup max · ${max}`}
          code={`<LiquidGlassAvatarGroup max={${max}}>\n  <LiquidGlassAvatar fallback="A" size="sm" />\n  ...\n</LiquidGlassAvatarGroup>`}
        >
          <LiquidGlassAvatarGroup max={max}>
            <LiquidGlassAvatar fallback="A" size="sm" />
            <LiquidGlassAvatar fallback="B" size="sm" />
            <LiquidGlassAvatar fallback="C" size="sm" />
            <LiquidGlassAvatar fallback="D" size="sm" />
            <LiquidGlassAvatar fallback="E" size="sm" />
          </LiquidGlassAvatarGroup>
        </DemoBlock>
      ))}

      {GLASS_PRESETS.slice(1, 3).map((preset) => (
        <DemoBlock
          key={`list-glass-${preset.id}`}
          title={`List glassParams · ${preset.label}`}
          code={`<LiquidGlassList\n${glassPropsLine(preset.params)} items={items} />`}
        >
          <LiquidGlassList
            glassParams={preset.params}
            items={LIST_ITEMS.slice(0, 3).map((item) => ({
              ...item,
              selected: listSelected === item.id,
              onClick: () => setListSelected(item.id),
            }))}
            style={{ width: 320 }}
          />
        </DemoBlock>
      ))}

      <DemoBlock
        title="List selected / disabled"
        description="selected 行高亮 · disabled 行不可点"
        code={`items={[\n  { id: '1', title: '...', selected: true, onClick },\n  { id: '4', title: '...', disabled: true },\n]}`}
      >
        <LiquidGlassList
          items={LIST_ITEMS.map((item) => ({
            ...item,
            selected: listSelected === item.id,
            onClick: item.disabled ? undefined : () => setListSelected(item.id),
          }))}
          style={{ width: 320 }}
        />
      </DemoBlock>
    </DemoSection>
  )
}

export function NavigationSection() {
  const [page, setPage] = useState(2)

  return (
    <DemoSection
      id="navigation"
      title="Navigation"
      hint="Navbar / Breadcrumb / Pagination / Dock"
      propsHint="Drawer (见 Overlay): side?: left | right · Dock 默认 dock 圆角 preset · Breadcrumb item: label, href?, onClick?"
    >
      {GLASS_PRESETS.slice(0, 3).map((preset) => (
        <DemoBlock
          key={`navbar-glass-${preset.id}`}
          title={`Navbar glassParams · ${preset.label}`}
          code={`<LiquidGlassNavbar brand="Brand"\n${glassPropsLine(preset.params)}>\n  <LiquidGlassButton size="sm">Docs</LiquidGlassButton>\n</LiquidGlassNavbar>`}
        >
          <LiquidGlassNavbar brand="Liquid Glass" glassParams={preset.params} style={{ width: '100%' }}>
            <LiquidGlassButton size="sm">Docs</LiquidGlassButton>
            <LiquidGlassIconButton aria-label="Menu">☰</LiquidGlassIconButton>
          </LiquidGlassNavbar>
        </DemoBlock>
      ))}

      <DemoBlock
        title="Breadcrumb items"
        code={`<LiquidGlassBreadcrumb items={[\n  { label: 'Home', href: '/' },\n  { label: 'Components', onClick: () => {} },\n  { label: 'Current' },\n]} />`}
      >
        <LiquidGlassBreadcrumb
          items={[
            { label: 'Home', href: '#' },
            { label: 'Components', onClick: () => {} },
            { label: 'Navbar' },
          ]}
        />
      </DemoBlock>

      <DemoBlock
        title="Pagination page / totalPages"
        code={`<LiquidGlassPagination page={2} totalPages={5} onPageChange={setPage} />`}
      >
        <LiquidGlassPagination page={page} totalPages={5} onPageChange={setPage} />
        <LiquidGlassPagination page={1} totalPages={1} />
      </DemoBlock>

      {GLASS_PRESETS.slice(1, 3).map((preset) => (
        <DemoBlock
          key={`dock-glass-${preset.id}`}
          title={`Dock glassParams · ${preset.label}`}
          description="默认 preset dock 圆角 (24px)，可被 glassParams 覆盖"
          code={`<LiquidGlassDock\n${glassPropsLine(preset.params)} items={items} />`}
        >
          <LiquidGlassDock glassParams={preset.params} items={DOCK_ITEMS} />
        </DemoBlock>
      ))}
    </DemoSection>
  )
}

export function OverlaySection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerLeftOpen, setDrawerLeftOpen] = useState(false)
  const [drawerRightOpen, setDrawerRightOpen] = useState(false)
  const [toastVariant, setToastVariant] = useState<'default' | 'success' | 'error' | null>(null)

  useEffect(() => {
    if (!toastVariant) return
    const timer = window.setTimeout(() => setToastVariant(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toastVariant])

  const alertVariants = ['info', 'success', 'warning', 'error'] as const
  const toastVariants = ['default', 'success', 'error'] as const

  return (
    <DemoSection
      id="overlay"
      title="Modal & Feedback"
      hint="Alert / Tooltip / Popover / Modal / Drawer / Toast"
      propsHint="Alert variant: info | success | warning | error · Toast variant: default | success | error · Modal/Drawer: open?, title?, footer?, onClose?, glassParams?"
    >
      {alertVariants.map((variant) => (
        <DemoBlock
          key={`alert-${variant}`}
          title={`Alert variant · ${variant}`}
          code={`<LiquidGlassAlert variant="${variant}" title="${variant}">\n  Message content.\n</LiquidGlassAlert>`}
        >
          <LiquidGlassAlert variant={variant} title={variant.charAt(0).toUpperCase() + variant.slice(1)}>
            Semantic border color for {variant} state.
          </LiquidGlassAlert>
        </DemoBlock>
      ))}

      {GLASS_PRESETS.slice(1, 3).map((preset) => (
        <DemoBlock
          key={`alert-glass-${preset.id}`}
          title={`Alert glassParams · ${preset.label}`}
          code={`<LiquidGlassAlert\n${glassPropsLine(preset.params)} variant="info" title="Info">\n  ...\n</LiquidGlassAlert>`}
        >
          <LiquidGlassAlert glassParams={preset.params} variant="info" title="Info">
            Custom glass refraction on alert surface.
          </LiquidGlassAlert>
        </DemoBlock>
      ))}

      {GLASS_PRESETS.slice(1, 3).map((preset) => (
        <DemoBlock
          key={`tooltip-glass-${preset.id}`}
          title={`Tooltip glassParams · ${preset.label}`}
          code={`<LiquidGlassTooltip\n${glassPropsLine(preset.params)} content="Tooltip">\n  <LiquidGlassButton>Hover</LiquidGlassButton>\n</LiquidGlassTooltip>`}
        >
          <LiquidGlassTooltip glassParams={preset.params} content={`${preset.label} tooltip`}>
            <LiquidGlassButton size="sm">Hover</LiquidGlassButton>
          </LiquidGlassTooltip>
        </DemoBlock>
      ))}

      {GLASS_PRESETS.slice(1, 3).map((preset) => (
        <DemoBlock
          key={`popover-glass-${preset.id}`}
          title={`Popover glassParams · ${preset.label}`}
          code={`<LiquidGlassPopover\n${glassPropsLine(preset.params)}\n  trigger={<LiquidGlassButton>Open</LiquidGlassButton>}\n  content="Panel"\n/>`}
        >
          <LiquidGlassPopover
            glassParams={preset.params}
            trigger={<LiquidGlassButton size="sm">Popover</LiquidGlassButton>}
            content={`${preset.label} popover content.`}
          />
        </DemoBlock>
      ))}

      <DemoBlock
        title="Modal · open / title / footer / onClose"
        code={`<LiquidGlassModal\n  open={open}\n  title="Glass Modal"\n  onClose={() => setOpen(false)}\n  footer={<LiquidGlassButton>OK</LiquidGlassButton>}\n>\n  Content\n</LiquidGlassModal>`}
      >
        <LiquidGlassButton size="sm" onClick={() => setModalOpen(true)}>
          Open Modal
        </LiquidGlassButton>
      </DemoBlock>

      {GLASS_PRESETS.slice(1, 2).map((preset) => (
        <DemoBlock
          key={`modal-glass-${preset.id}`}
          title={`Modal glassParams · ${preset.label}`}
          code={`<LiquidGlassModal\n${glassPropsLine(preset.params)} open={open} title="Modal" />`}
        >
          <LiquidGlassButton size="sm" onClick={() => setModalOpen(true)}>
            Modal ({preset.label})
          </LiquidGlassButton>
        </DemoBlock>
      ))}

      <DemoBlock
        title='Drawer side · left / right'
        code={`<LiquidGlassDrawer side="left" open={open} title="Left" onClose={...} />\n<LiquidGlassDrawer side="right" open={open} title="Right" onClose={...} />`}
      >
        <LiquidGlassButton size="sm" onClick={() => setDrawerLeftOpen(true)}>
          Left Drawer
        </LiquidGlassButton>
        <LiquidGlassButton size="sm" onClick={() => setDrawerRightOpen(true)}>
          Right Drawer
        </LiquidGlassButton>
      </DemoBlock>

      {toastVariants.map((variant) => (
        <DemoBlock
          key={`toast-${variant}`}
          title={`Toast variant · ${variant}`}
          code={`<LiquidGlassToast\n  open={open}\n  variant="${variant}"\n  title="Notification"\n  description="..."\n/>`}
        >
          <LiquidGlassButton size="sm" onClick={() => setToastVariant(variant)}>
            Show {variant}
          </LiquidGlassButton>
        </DemoBlock>
      ))}

      <LiquidGlassModal
        open={modalOpen}
        title="Glass Modal"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <LiquidGlassButton size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </LiquidGlassButton>
            <LiquidGlassButton size="sm" onClick={() => setModalOpen(false)}>
              Confirm
            </LiquidGlassButton>
          </>
        }
      >
        Modal dialog with liquid glass refraction. ESC 或点击遮罩关闭。
      </LiquidGlassModal>

      <LiquidGlassDrawer
        open={drawerLeftOpen}
        side="left"
        title="Left Drawer"
        onClose={() => setDrawerLeftOpen(false)}
      >
        <p>side=&quot;left&quot; 从左侧滑入</p>
        <LiquidGlassButton size="sm" onClick={() => setDrawerLeftOpen(false)}>
          Close
        </LiquidGlassButton>
      </LiquidGlassDrawer>

      <LiquidGlassDrawer
        open={drawerRightOpen}
        side="right"
        title="Right Drawer"
        onClose={() => setDrawerRightOpen(false)}
      >
        <p>side=&quot;right&quot; 从右侧滑入</p>
        <LiquidGlassButton size="sm" onClick={() => setDrawerRightOpen(false)}>
          Close
        </LiquidGlassButton>
      </LiquidGlassDrawer>

      {toastVariant && (
        <LiquidGlassToast
          open
          variant={toastVariant}
          title="Notification"
          description={`Toast variant="${toastVariant}"`}
        />
      )}
    </DemoSection>
  )
}
