import { useEffect, useRef, useState, type JSX, type ReactNode } from 'react'
import {
  AffixLiquidGlass,
  AlertLiquidGlass,
  AnchorLiquidGlass,
  AvatarLiquidGlass,
  AvatarGroupLiquidGlass,
  BadgeLiquidGlass,
  BreadcrumbLiquidGlass,
  ButtonLiquidGlass,
  ButtonGroupLiquidGlass,
  CardLiquidGlass,
  CheckboxLiquidGlass,
  CollapseLiquidGlass,
  DividerLiquidGlass,
  DockLiquidGlass,
  DrawerLiquidGlass,
  DropdownLiquidGlass,
  EmptyLiquidGlass,
  FloatButtonLiquidGlass,
  IconButtonLiquidGlass,
  InputLiquidGlass,
  ListLiquidGlass,
  MediaCardLiquidGlass,
  MenuLiquidGlass,
  ModalLiquidGlass,
  NavbarLiquidGlass,
  PaginationLiquidGlass,
  PopconfirmLiquidGlass,
  PopoverLiquidGlass,
  ProgressLiquidGlass,
  RadioLiquidGlass,
  RadioLiquidGlassGroup,
  RateLiquidGlass,
  ResultLiquidGlass,
  SelectLiquidGlass,
  SkeletonLiquidGlass,
  SliderLiquidGlass,
  SpaceLiquidGlass,
  SpinLiquidGlass,
  StatisticLiquidGlass,
  StepsLiquidGlass,
  SwitchLiquidGlass,
  TabsLiquidGlass,
  TagLiquidGlass,
  TextareaLiquidGlass,
  TimelineLiquidGlass,
  ToastLiquidGlass,
  TooltipLiquidGlass,
  TypographyLiquidGlass,
} from '../components'
import type { LiquidGlassParams } from '../lib/liquid-glass'
import { DemoBlock } from './DemoBlock'
import { DemoGlassControls } from './DemoGlassControls'
import {
  DEMO_BUTTON_GROUPS,
  DEMO_BUTTONS,
  INITIAL_GROUP_VALUES,
  type DemoButtonConfig,
  type DemoButtonGroupConfig,
} from './demoData'
import { DEMO_NAV_ITEMS } from './demoNav'
import {
  DisabledDemoBlock,
  GlassPresetDemoBlocks,
  LIQUID_GLASS_VARIANTS,
  SizeDemoBlock,
  VariantDemoBlock,
} from './demoSectionHelpers'
import { FILL_PRESETS, GLASS_PRESETS, PANEL_PRESETS, THUMB_PRESETS } from './demoVariants'
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

const TIMELINE_ITEMS = [
  { key: '1', label: '2024-01', children: 'Create project' },
  { key: '2', label: '2024-06', children: 'Release v1.0' },
  { key: '3', label: '2025-03', children: 'Liquid glass refresh' },
]

const STEPS_ITEMS = [
  { title: 'Finished', description: 'Step 1' },
  { title: 'In Progress', description: 'Step 2' },
  { title: 'Waiting', description: 'Step 3' },
]

const ANCHOR_LINKS = DEMO_NAV_ITEMS.filter(({ id }) => id !== 'anchor').map(({ id, label }) => ({
  key: id,
  href: `#${id}`,
  title: label,
}))

function buttonCode(demo: DemoButtonConfig): string {
  return `<ButtonLiquidGlass\n${sizePropLine(demo.size)}${glassPropsLine(demo.glassParams)}>\n  ${demo.label}\n</ButtonLiquidGlass>`
}

function buttonGroupCode(demo: DemoButtonGroupConfig): string {
  const lines: string[] = ['<ButtonGroupLiquidGlass']
  if (demo.variant === 'slider') lines.push('  variant="slider"')
  if (demo.size && demo.size !== 'md') lines.push(`  size="${demo.size}"`)
  lines.push(`  defaultValue="${demo.defaultValue}"`)
  const gp = formatGlassParams(demo.glassParams)
  if (gp) lines.push(`  glassParams={${gp}}`)
  const tgp = formatGlassParams(demo.thumbGlassParams)
  if (tgp) lines.push(`  thumbGlassParams={${tgp}}`)
  lines.push('>')
  demo.items.forEach((item) => {
    lines.push(`  <ButtonGroupLiquidGlass.Item value="${item.value}">${item.label}</ButtonGroupLiquidGlass.Item>`)
  })
  lines.push('</ButtonGroupLiquidGlass>')
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
        title="Provider 全局参数"
        description="左侧边栏底部可实时调节；此处同步展示当前 Provider 注入值"
        code={`<LiquidGlassProvider glassParams={${formatGlassParams(globalGlass) || '{ ... }'}}>
  <App />
</LiquidGlassProvider>`}
      >
        <DemoGlassControls
          className="demo-theme-controls"
          value={globalGlass}
          onChange={onThemeChange}
        />
      </DemoBlock>

      {GLASS_PRESETS.map((preset) => (
        <DemoBlock
          key={`theme-${preset.id}`}
          title={`glassParams · ${preset.label}`}
          description={preset.description}
          code={`<ButtonLiquidGlass\n${glassPropsLine(preset.params)}>\n  Preview\n</ButtonLiquidGlass>`}
        >
          <ButtonLiquidGlass glassParams={preset.params}>Preview</ButtonLiquidGlass>
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
      propsHint="Props: glassParams?, variant?: default | primary | danger | success, size?, disabled?, onClick"
    >
      <VariantDemoBlock
        component="ButtonLiquidGlass"
        render={(variant, label) => (
          <ButtonLiquidGlass key={variant} variant={variant}>
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </ButtonLiquidGlass>
        )}
      />

      <SizeDemoBlock
        component="ButtonLiquidGlass"
        render={(size) => (
          <ButtonLiquidGlass key={size} size={size}>
            {size.toUpperCase()}
          </ButtonLiquidGlass>
        )}
      />

      <DisabledDemoBlock
        component="ButtonLiquidGlass"
        renderDisabled={<ButtonLiquidGlass disabled>Disabled</ButtonLiquidGlass>}
        renderEnabled={<ButtonLiquidGlass>Enabled</ButtonLiquidGlass>}
      />

      {DEMO_BUTTONS.map((demo) => (
        <DemoBlock key={demo.id} title={`glassParams · ${demo.label}`} code={buttonCode(demo)}>
          <ButtonLiquidGlass size={demo.size} glassParams={demo.glassParams}>
            {demo.label}
          </ButtonLiquidGlass>
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
      <ButtonGroupLiquidGlass.Item key={itemValue} value={itemValue}>
        {label}
      </ButtonGroupLiquidGlass.Item>
    ))

    if (demo.variant === 'slider') {
      return (
        <ButtonGroupLiquidGlass
          name={demo.name}
          size={demo.size}
          variant="slider"
          glassParams={demo.glassParams}
          thumbGlassParams={demo.thumbGlassParams}
          value={value}
          onValueChange={onChange}
        >
          {items}
        </ButtonGroupLiquidGlass>
      )
    }

    return (
      <ButtonGroupLiquidGlass
        name={demo.name}
        size={demo.size}
        glassParams={demo.glassParams}
        value={value}
        onValueChange={onChange}
      >
        {items}
      </ButtonGroupLiquidGlass>
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
      <SizeDemoBlock
        component="ButtonGroupLiquidGlass"
        render={(size) => (
          <ButtonGroupLiquidGlass key={size} variant="slider" size={size} defaultValue="a">
            <ButtonGroupLiquidGlass.Item value="a">A</ButtonGroupLiquidGlass.Item>
            <ButtonGroupLiquidGlass.Item value="b">B</ButtonGroupLiquidGlass.Item>
          </ButtonGroupLiquidGlass>
        )}
      />

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

export function IconButtonSection() {
  return (
    <DemoSection
      id="icon-button"
      title="Icon Button"
      hint="圆形图标按钮 — aria-label 必填"
      propsHint="Props: size?, variant?, disabled?, glassParams?, aria-label (必填)"
    >
      <SizeDemoBlock
        component="IconButtonLiquidGlass"
        render={(size) => (
          <>
            <IconButtonLiquidGlass key={`${size}-star`} size={size} aria-label="Star">
              ⭐
            </IconButtonLiquidGlass>
            <IconButtonLiquidGlass key={`${size}-settings`} size={size} aria-label="Settings">
              ⚙️
            </IconButtonLiquidGlass>
          </>
        )}
      />

      <VariantDemoBlock
        component="IconButtonLiquidGlass"
        render={(variant) => (
          <IconButtonLiquidGlass key={variant} variant={variant} aria-label={variant}>
            ✦
          </IconButtonLiquidGlass>
        )}
      />

      <DisabledDemoBlock
        component="IconButtonLiquidGlass"
        renderDisabled={
          <IconButtonLiquidGlass disabled aria-label="Disabled">
            ✦
          </IconButtonLiquidGlass>
        }
        renderEnabled={
          <IconButtonLiquidGlass aria-label="Enabled">
            ✦
          </IconButtonLiquidGlass>
        }
      />

      <GlassPresetDemoBlocks
        component="IconButtonLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 4)}
        extraProps='aria-label="Star"'
        render={(preset) => (
          <IconButtonLiquidGlass glassParams={preset.params} aria-label="Star">
            ⭐
          </IconButtonLiquidGlass>
        )}
      />
    </DemoSection>
  )
}

export function FloatButtonSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <DemoSection
      id="float-button"
      title="Float Button"
      hint="悬浮操作按钮"
      propsHint="Props: shape?: circle | square, variant?, icon?, description?, disabled?, onClick?"
    >
      <DemoBlock
        title="点击返回顶部"
        description="固定于视口右下角，点击平滑滚动至页面顶部"
        code={`<FloatButtonLiquidGlass\n  icon="↑"\n  aria-label="返回顶部"\n  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}\n/>`}
      >
        <FloatButtonLiquidGlass icon="↑" aria-label="返回顶部" onClick={scrollToTop} />
      </DemoBlock>

      <DemoBlock
        title="shape · circle / square"
        code={`<FloatButtonLiquidGlass shape="circle" icon="+" />\n<FloatButtonLiquidGlass shape="square" icon="+" />`}
      >
        <div style={{ position: 'relative', height: 88, width: '100%' }}>
          <FloatButtonLiquidGlass
            icon="+"
            description="Circle"
            style={{ position: 'absolute', left: 0, bottom: 0 }}
          />
          <FloatButtonLiquidGlass
            shape="square"
            icon="+"
            description="Square"
            style={{ position: 'absolute', left: 72, bottom: 0 }}
          />
        </div>
      </DemoBlock>

      <VariantDemoBlock
        component="FloatButtonLiquidGlass"
        render={(variant) => (
          <div key={variant} style={{ position: 'relative', height: 56, width: 56 }}>
            <FloatButtonLiquidGlass
              variant={variant}
              icon="↑"
              aria-label={variant}
              style={{ position: 'absolute', left: 0, bottom: 0 }}
            />
          </div>
        )}
      />

      <DisabledDemoBlock
        component="FloatButtonLiquidGlass"
        renderDisabled={
          <FloatButtonLiquidGlass
            disabled
            icon="↑"
            aria-label="返回顶部"
            style={{ position: 'relative' }}
          />
        }
        renderEnabled={
          <FloatButtonLiquidGlass
            icon="↑"
            aria-label="返回顶部"
            onClick={scrollToTop}
            style={{ position: 'relative' }}
          />
        }
      />
    </DemoSection>
  )
}

export function BadgeSection() {
  return (
    <DemoSection
      id="badge"
      title="Badge"
      hint="标签 / Chip 外形"
      propsHint="Props: shape?: badge | chip, size?, tone?, glassParams?"
    >
      <DemoBlock
        title="shape · badge / chip"
        description="chip 使用 pill 圆角预设"
        code={`<BadgeLiquidGlass shape="badge">Beta</BadgeLiquidGlass>\n<BadgeLiquidGlass shape="chip">Chip</BadgeLiquidGlass>`}
      >
        <BadgeLiquidGlass shape="badge">Beta</BadgeLiquidGlass>
        <BadgeLiquidGlass shape="chip">Chip</BadgeLiquidGlass>
      </DemoBlock>

      <SizeDemoBlock
        component="BadgeLiquidGlass"
        render={(size) => (
          <>
            <BadgeLiquidGlass key={`${size}-badge`} size={size}>
              Badge
            </BadgeLiquidGlass>
            <BadgeLiquidGlass key={`${size}-chip`} size={size} shape="chip">
              Chip
            </BadgeLiquidGlass>
          </>
        )}
      />

      <DemoBlock
        title="tone · semantic colors"
        code={LIQUID_GLASS_VARIANTS.map(
          (v) => `<BadgeLiquidGlass tone="${v}">${v}</BadgeLiquidGlass>`,
        ).join('\n')}
      >
        {LIQUID_GLASS_VARIANTS.map((tone) => (
          <BadgeLiquidGlass key={tone} tone={tone}>
            {tone}
          </BadgeLiquidGlass>
        ))}
      </DemoBlock>

      <GlassPresetDemoBlocks
        component="BadgeLiquidGlass"
        render={(preset) => (
          <BadgeLiquidGlass glassParams={preset.params}>{preset.label}</BadgeLiquidGlass>
        )}
      />
    </DemoSection>
  )
}

export function TagSection() {
  return (
    <DemoSection
      id="tag"
      title="Tag"
      hint="可关闭标签 — variant 与 legacy color"
      propsHint="Props: variant?, size?, closable?, color? (legacy), glassParams?"
    >
      <VariantDemoBlock
        component="TagLiquidGlass"
        render={(variant, label) => (
          <TagLiquidGlass key={variant} variant={variant}>
            {label}
          </TagLiquidGlass>
        )}
      />

      <SizeDemoBlock
        component="TagLiquidGlass"
        render={(size) => (
          <TagLiquidGlass key={size} size={size}>
            {size.toUpperCase()}
          </TagLiquidGlass>
        )}
      />

      <DemoBlock
        title="closable"
        code={`<TagLiquidGlass closable onClose={() => {}}>Closable</TagLiquidGlass>`}
      >
        <TagLiquidGlass closable onClose={() => {}}>
          Closable
        </TagLiquidGlass>
        <TagLiquidGlass variant="primary" closable onClose={() => {}}>
          Primary
        </TagLiquidGlass>
      </DemoBlock>

      <DemoBlock
        title="color · legacy semantic"
        description="color 映射 variant；warning 保留 legacy 样式类"
        code={`<TagLiquidGlass color="warning">Warning</TagLiquidGlass>\n<TagLiquidGlass color="info">Info</TagLiquidGlass>`}
      >
        <TagLiquidGlass color="warning">Warning</TagLiquidGlass>
        <TagLiquidGlass color="info">Info</TagLiquidGlass>
        <TagLiquidGlass color="success">Success</TagLiquidGlass>
        <TagLiquidGlass color="error">Error</TagLiquidGlass>
      </DemoBlock>
    </DemoSection>
  )
}

export function AvatarSection() {
  return (
    <DemoSection
      id="avatar"
      title="Avatar"
      hint="头像 — fallback 或 src"
      propsHint="Props: size?, src?, fallback?, glassParams?"
    >
      <SizeDemoBlock
        component="AvatarLiquidGlass"
        render={(size) => <AvatarLiquidGlass key={size} size={size} fallback="LG" />}
      />

      <DemoBlock
        title="fallback / custom glass"
        code={`<AvatarLiquidGlass fallback="AB" />\n<AvatarLiquidGlass fallback="CD" glassParams={{ strength: 1.3 }} />`}
      >
        <AvatarLiquidGlass fallback="AB" />
        <AvatarLiquidGlass fallback="CD" glassParams={{ strength: 1.3 }} />
      </DemoBlock>

      <GlassPresetDemoBlocks
        component="AvatarLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 3)}
        extraProps='fallback="GL"'
        render={(preset) => (
          <AvatarLiquidGlass glassParams={preset.params} fallback="GL" />
        )}
      />
    </DemoSection>
  )
}

export function AvatarGroupSection() {
  return (
    <DemoSection
      id="avatar-group"
      title="Avatar Group"
      hint="头像组 — max 限制显示数量"
      propsHint="Props: max?, glassParams?, children: AvatarLiquidGlass[]"
    >
      {[2, 3, 4].map((max) => (
        <DemoBlock
          key={`avatar-group-max-${max}`}
          title={`max · ${max}`}
          code={`<AvatarGroupLiquidGlass max={${max}}>\n  <AvatarLiquidGlass fallback="A" size="sm" />\n  ...\n</AvatarGroupLiquidGlass>`}
        >
          <AvatarGroupLiquidGlass max={max}>
            <AvatarLiquidGlass fallback="A" size="sm" />
            <AvatarLiquidGlass fallback="B" size="sm" />
            <AvatarLiquidGlass fallback="C" size="sm" />
            <AvatarLiquidGlass fallback="D" size="sm" />
            <AvatarLiquidGlass fallback="E" size="sm" />
          </AvatarGroupLiquidGlass>
        </DemoBlock>
      ))}
    </DemoSection>
  )
}

export function CardSection() {
  return (
    <DemoSection
      id="card"
      title="Card"
      hint="复合卡片 — Header / Body / Footer"
      propsHint="Props: size?, glassParams?, Header/Body/Footer 子组件"
    >
      <SizeDemoBlock
        component="CardLiquidGlass"
        render={(size) => (
          <CardLiquidGlass key={size} size={size} style={{ width: 280 }}>
            <CardLiquidGlass.Header>Size {size.toUpperCase()}</CardLiquidGlass.Header>
            <CardLiquidGlass.Body>Card body content.</CardLiquidGlass.Body>
          </CardLiquidGlass>
        )}
      />

      <GlassPresetDemoBlocks
        component="CardLiquidGlass"
        render={(preset) => (
          <CardLiquidGlass glassParams={preset.params} style={{ width: 280 }}>
            <CardLiquidGlass.Header>{preset.label}</CardLiquidGlass.Header>
            <CardLiquidGlass.Body>{preset.description}</CardLiquidGlass.Body>
            <CardLiquidGlass.Footer>
              <ButtonLiquidGlass size="sm">Action</ButtonLiquidGlass>
            </CardLiquidGlass.Footer>
          </CardLiquidGlass>
        )}
      />
    </DemoSection>
  )
}

export function MediaCardSection() {
  return (
    <DemoSection
      id="media-card"
      title="Media Card"
      hint="媒体卡片 — 封装 Card"
      propsHint="Props: image?, title?, description?, footer?, size?, glassParams?"
    >
      <DemoBlock
        title="无 image"
        code={`<MediaCardLiquidGlass\n  title="Title"\n  description="Description text"\n  footer={<BadgeLiquidGlass shape="chip">New</BadgeLiquidGlass>}\n/>`}
      >
        <MediaCardLiquidGlass
          title="No Image"
          description="image prop 可选，不传则仅文字区域"
          footer={<BadgeLiquidGlass shape="chip">New</BadgeLiquidGlass>}
          style={{ width: 280 }}
        />
      </DemoBlock>

      <SizeDemoBlock
        component="MediaCardLiquidGlass"
        render={(size) => (
          <MediaCardLiquidGlass
            key={size}
            size={size}
            title={`Media ${size}`}
            description="size 影响内边距"
            style={{ width: 280 }}
          />
        )}
      />

      <GlassPresetDemoBlocks
        component="MediaCardLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 3)}
        extraProps='title="Media"'
        render={(preset) => (
          <MediaCardLiquidGlass
            glassParams={preset.params}
            title={preset.label}
            description={preset.description}
            style={{ width: 280 }}
          />
        )}
      />
    </DemoSection>
  )
}

export function ListSection() {
  const [listSelected, setListSelected] = useState('1')

  return (
    <DemoSection
      id="list"
      title="List"
      hint="单容器 1 filter · 行内 selected 高亮"
      propsHint="List item: id, title, description?, selected?, disabled?, onClick?"
    >
      <DemoBlock
        title="selected / disabled"
        description="selected 行高亮 · disabled 行不可点"
        code={`items={[\n  { id: '1', title: '...', selected: true, onClick },\n  { id: '4', title: '...', disabled: true },\n]}`}
      >
        <ListLiquidGlass
          items={LIST_ITEMS.map((item) => ({
            ...item,
            selected: listSelected === item.id,
            onClick: item.disabled ? undefined : () => setListSelected(item.id),
          }))}
          style={{ width: 320 }}
        />
      </DemoBlock>

      <GlassPresetDemoBlocks
        component="ListLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 3)}
        extraProps="items={items}"
        render={(preset) => (
          <ListLiquidGlass
            glassParams={preset.params}
            items={LIST_ITEMS.slice(0, 3).map((item) => ({
              ...item,
              selected: listSelected === item.id,
              onClick: () => setListSelected(item.id),
            }))}
            style={{ width: 320 }}
          />
        )}
      />
    </DemoSection>
  )
}

export function EmptySection() {
  return (
    <DemoSection id="empty" title="Empty" hint="空状态占位" propsHint="Props: description?, children?">
      <DemoBlock title="description + action" code={`<EmptyLiquidGlass description="暂无数据" />`}>
        <EmptyLiquidGlass description="暂无数据">
          <ButtonLiquidGlass size="sm">创建</ButtonLiquidGlass>
        </EmptyLiquidGlass>
      </DemoBlock>
    </DemoSection>
  )
}

export function StatisticSection() {
  return (
    <DemoSection
      id="statistic"
      title="Statistic"
      hint="统计数值展示"
      propsHint="Props: title?, value?, suffix?, prefix?, glassParams?"
    >
      <DemoBlock
        title="title / value / suffix"
        code={`<StatisticLiquidGlass title="Users" value={112893} suffix="人" />`}
      >
        <StatisticLiquidGlass title="Active Users" value={112893} suffix="人" />
        <StatisticLiquidGlass title="Conversion" value={93.2} suffix="%" />
      </DemoBlock>

      <GlassPresetDemoBlocks
        component="StatisticLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 3)}
        extraProps='title="Metric" value={1280}'
        render={(preset) => (
          <StatisticLiquidGlass
            glassParams={preset.params}
            title={preset.label}
            value={1280}
            suffix="pts"
          />
        )}
      />
    </DemoSection>
  )
}

export function TimelineSection() {
  return (
    <DemoSection
      id="timeline"
      title="Timeline"
      hint="时间轴 — left / alternate 布局"
      propsHint="Props: items[], mode?: left | alternate, variant?, glassParams?"
    >
      <DemoBlock
        title="mode · left"
        code={`<TimelineLiquidGlass mode="left" items={items} />`}
      >
        <TimelineLiquidGlass items={TIMELINE_ITEMS} style={{ width: 320 }} />
      </DemoBlock>

      <DemoBlock
        title="mode · alternate"
        code={`<TimelineLiquidGlass mode="alternate" items={items} />`}
      >
        <TimelineLiquidGlass
          mode="alternate"
          items={TIMELINE_ITEMS}
          style={{ width: 360 }}
        />
      </DemoBlock>

      <VariantDemoBlock
        component="TimelineLiquidGlass"
        render={(variant) => (
          <TimelineLiquidGlass
            key={variant}
            variant={variant}
            items={TIMELINE_ITEMS.slice(0, 2)}
            style={{ width: 320 }}
          />
        )}
      />
    </DemoSection>
  )
}

export function CollapseSection() {
  return (
    <DemoSection
      id="collapse"
      title="Collapse"
      hint="折叠面板"
      propsHint="Props: items[], accordion?, defaultActiveKeys?, glassParams?"
    >
      <DemoBlock
        title="accordion"
        code={`<CollapseLiquidGlass accordion items={[...]} defaultActiveKeys={['1']} />`}
      >
        <CollapseLiquidGlass
          accordion
          defaultActiveKeys={['1']}
          items={[
            { key: '1', label: 'Panel 1', children: 'Collapse panel content one.' },
            { key: '2', label: 'Panel 2', children: 'Panel two with glass surface.' },
          ]}
          style={{ width: 320 }}
        />
      </DemoBlock>

      <DemoBlock
        title="multiple panels"
        code={`<CollapseLiquidGlass defaultActiveKeys={['a', 'b']} items={items} />`}
      >
        <CollapseLiquidGlass
          defaultActiveKeys={['a']}
          items={[
            { key: 'a', label: 'Section A', children: 'First section content.' },
            { key: 'b', label: 'Section B', children: 'Second section content.' },
            { key: 'c', label: 'Section C', children: 'Third section content.' },
          ]}
          style={{ width: 320 }}
        />
      </DemoBlock>
    </DemoSection>
  )
}

export function TypographySection() {
  return (
    <DemoSection id="typography" title="Typography" hint="标题 / 段落 / 文本" propsHint="Title level, Text type, Paragraph">
      <DemoBlock
        title="Title / Paragraph / Text"
        code={`<TypographyLiquidGlass.Title level={2}>Title</TypographyLiquidGlass.Title>`}
      >
        <TypographyLiquidGlass.Title level={2}>Liquid Glass</TypographyLiquidGlass.Title>
        <TypographyLiquidGlass.Paragraph>
          Paragraph with secondary tone and glass-friendly contrast.
        </TypographyLiquidGlass.Paragraph>
        <TypographyLiquidGlass.Text type="success">Success text</TypographyLiquidGlass.Text>
        {' · '}
        <TypographyLiquidGlass.Text type="danger" delete>
          Deleted
        </TypographyLiquidGlass.Text>
      </DemoBlock>
    </DemoSection>
  )
}

export function InputSection() {
  return (
    <DemoSection
      id="input"
      title="Input"
      hint="单行输入"
      propsHint="Props: size?, variant?, disabled?, placeholder?, glassParams?"
    >
      <SizeDemoBlock
        component="InputLiquidGlass"
        render={(size) => (
          <InputLiquidGlass
            key={size}
            size={size}
            placeholder={`${size} input`}
            style={{ minWidth: 180 }}
          />
        )}
      />

      <VariantDemoBlock
        component="InputLiquidGlass"
        render={(variant) => (
          <InputLiquidGlass
            key={variant}
            variant={variant}
            placeholder={variant}
            style={{ minWidth: 180 }}
          />
        )}
      />

      <DisabledDemoBlock
        component="InputLiquidGlass"
        renderDisabled={
          <InputLiquidGlass disabled placeholder="Disabled" style={{ minWidth: 180 }} />
        }
        renderEnabled={
          <InputLiquidGlass placeholder="Enabled" style={{ minWidth: 180 }} />
        }
      />

      <GlassPresetDemoBlocks
        component="InputLiquidGlass"
        extraProps='placeholder="Search…"'
        render={(preset) => (
          <InputLiquidGlass
            glassParams={preset.params}
            placeholder={preset.label}
            style={{ minWidth: 180 }}
          />
        )}
      />
    </DemoSection>
  )
}

export function TextareaSection() {
  return (
    <DemoSection
      id="textarea"
      title="Textarea"
      hint="多行输入"
      propsHint="Props: size?, variant?, disabled?, rows?, glassParams?"
    >
      <SizeDemoBlock
        component="TextareaLiquidGlass"
        render={(size) => (
          <TextareaLiquidGlass
            key={size}
            size={size}
            rows={2}
            placeholder={`${size} textarea`}
            style={{ minWidth: 220 }}
          />
        )}
      />

      <DisabledDemoBlock
        component="TextareaLiquidGlass"
        renderDisabled={
          <TextareaLiquidGlass disabled rows={2} placeholder="Disabled" style={{ minWidth: 220 }} />
        }
        renderEnabled={
          <TextareaLiquidGlass rows={2} placeholder="Enabled" style={{ minWidth: 220 }} />
        }
      />

      <GlassPresetDemoBlocks
        component="TextareaLiquidGlass"
        presets={GLASS_PRESETS.slice(0, 4)}
        extraProps='rows={2} placeholder="Note…"'
        render={(preset) => (
          <TextareaLiquidGlass
            glassParams={preset.params}
            rows={2}
            placeholder={preset.label}
            style={{ minWidth: 220 }}
          />
        )}
      />
    </DemoSection>
  )
}

export function SelectSection() {
  const selectOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
  ]

  return (
    <DemoSection
      id="select"
      title="Select"
      hint="下拉选择"
      propsHint="Props: options[], size?, variant?, disabled?, value?, defaultValue?, onChange?, placeholder?, glassParams?, dropdownGlassParams?"
    >
      <SizeDemoBlock
        component="SelectLiquidGlass"
        render={(size) => (
          <SelectLiquidGlass
            key={size}
            size={size}
            defaultValue="react"
            options={selectOptions}
            style={{ minWidth: 160 }}
          />
        )}
      />

      <VariantDemoBlock
        component="SelectLiquidGlass"
        render={(variant) => (
          <SelectLiquidGlass
            key={variant}
            variant={variant}
            defaultValue="react"
            options={selectOptions}
            style={{ minWidth: 160 }}
          />
        )}
      />

      <DisabledDemoBlock
        component="SelectLiquidGlass"
        renderDisabled={
          <SelectLiquidGlass disabled defaultValue="react" options={selectOptions} style={{ minWidth: 160 }} />
        }
        renderEnabled={
          <SelectLiquidGlass defaultValue="react" options={selectOptions} style={{ minWidth: 160 }} />
        }
      />
    </DemoSection>
  )
}

export function CheckboxSection() {
  return (
    <DemoSection
      id="checkbox"
      title="Checkbox"
      hint="复选框"
      propsHint="Props: label?, size?, variant?, checked?, disabled?, onCheckedChange?"
    >
      <SizeDemoBlock
        component="CheckboxLiquidGlass"
        render={(size) => (
          <CheckboxLiquidGlass key={size} size={size} label={`Size ${size}`} defaultChecked />
        )}
      />

      <VariantDemoBlock
        component="CheckboxLiquidGlass"
        render={(variant) => (
          <CheckboxLiquidGlass key={variant} variant={variant} label={variant} defaultChecked />
        )}
      />

      <DisabledDemoBlock
        component="CheckboxLiquidGlass"
        renderDisabled={<CheckboxLiquidGlass label="Disabled" disabled />}
        renderEnabled={<CheckboxLiquidGlass label="Enabled" defaultChecked />}
      />
    </DemoSection>
  )
}

export function RadioSection() {
  const [radioValue, setRadioValue] = useState('a')

  return (
    <DemoSection
      id="radio"
      title="Radio"
      hint="单选组"
      propsHint="RadioGroup: value?, onValueChange? · Radio: value, label?, disabled?"
    >
      <DemoBlock
        title="RadioGroup value / onValueChange"
        code={`<RadioLiquidGlassGroup value={v} onValueChange={setV}>\n  <RadioLiquidGlass value="a">A</RadioLiquidGlass>\n</RadioLiquidGlassGroup>`}
      >
        <RadioLiquidGlassGroup value={radioValue} onValueChange={setRadioValue}>
          <RadioLiquidGlass value="a" label="Option A" />
          <RadioLiquidGlass value="b" label="Option B" />
          <RadioLiquidGlass value="c" label="Option C" disabled />
        </RadioLiquidGlassGroup>
      </DemoBlock>

      <SizeDemoBlock
        component="RadioLiquidGlassGroup"
        render={(size) => (
          <RadioLiquidGlassGroup key={size} size={size} defaultValue="a">
            <RadioLiquidGlass value="a" label="A" />
            <RadioLiquidGlass value="b" label="B" />
          </RadioLiquidGlassGroup>
        )}
      />

      <DemoBlock
        title="disabled"
        code={`<RadioLiquidGlassGroup defaultValue="enabled">\n  <RadioLiquidGlass value="disabled" label="Disabled" disabled />\n  <RadioLiquidGlass value="enabled" label="Enabled" />\n</RadioLiquidGlassGroup>`}
      >
        <RadioLiquidGlassGroup defaultValue="enabled">
          <RadioLiquidGlass value="disabled" label="Disabled" disabled />
          <RadioLiquidGlass value="enabled" label="Enabled" />
        </RadioLiquidGlassGroup>
      </DemoBlock>
    </DemoSection>
  )
}

export function SwitchSection() {
  const [switchOn, setSwitchOn] = useState(true)

  return (
    <DemoSection
      id="switch"
      title="Switch"
      hint="开关 — 点击 + 拖拽 thumb 吸附"
      propsHint="Props: size?, checked?, onCheckedChange?, thumbGlassParams?, glassParams?"
    >
      <SizeDemoBlock
        component="SwitchLiquidGlass"
        render={(size) => <SwitchLiquidGlass key={size} size={size} defaultChecked />}
      />

      <DemoBlock
        title="checked / unchecked"
        description="点击切换 · 拖拽 thumb 吸附"
        code={`<SwitchLiquidGlass checked={checked} onCheckedChange={setChecked} />`}
      >
        <SwitchLiquidGlass checked={switchOn} onCheckedChange={setSwitchOn} />
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
          {switchOn ? 'ON' : 'OFF'}
        </span>
      </DemoBlock>

      <DisabledDemoBlock
        component="SwitchLiquidGlass"
        renderDisabled={<SwitchLiquidGlass disabled defaultChecked />}
        renderEnabled={<SwitchLiquidGlass defaultChecked />}
      />

      {THUMB_PRESETS.map((preset) => (
        <DemoBlock
          key={`switch-thumb-${preset.id}`}
          title={`thumbGlassParams · ${preset.label}`}
          description="track 玻璃 + thumb 视觉强度"
          code={`<SwitchLiquidGlass\n${thumbPropsLine(preset.params)} defaultChecked />`}
        >
          <SwitchLiquidGlass thumbGlassParams={preset.params} defaultChecked />
        </DemoBlock>
      ))}

      <GlassPresetDemoBlocks
        component="SwitchLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 4)}
        extraProps="defaultChecked"
        render={(preset) => (
          <SwitchLiquidGlass glassParams={preset.params} defaultChecked />
        )}
      />
    </DemoSection>
  )
}

export function SliderSection() {
  const [sliderValue, setSliderValue] = useState(62)

  return (
    <DemoSection
      id="slider"
      title="Slider"
      hint="range 滑条 — track-only 玻璃"
      propsHint="Props: value?, onChange?, min?, max?, glassParams?"
    >
      <DemoBlock
        title="value · controlled"
        code={`<SliderLiquidGlass value={62} onChange={...} />`}
      >
        <SliderLiquidGlass
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          style={{ width: 220 }}
        />
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{sliderValue}</span>
      </DemoBlock>

      <DisabledDemoBlock
        component="SliderLiquidGlass"
        renderDisabled={
          <SliderLiquidGlass disabled value={40} style={{ width: 220 }} />
        }
        renderEnabled={
          <SliderLiquidGlass value={sliderValue} onChange={(e) => setSliderValue(Number(e.target.value))} style={{ width: 220 }} />
        }
      />

      <GlassPresetDemoBlocks
        component="SliderLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 4)}
        extraProps="value={62}"
        render={(preset) => (
          <SliderLiquidGlass
            glassParams={preset.params}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            style={{ width: 220 }}
          />
        )}
      />
    </DemoSection>
  )
}

export function RateSection() {
  const [rateValue, setRateValue] = useState(3)

  return (
    <DemoSection
      id="rate"
      title="Rate"
      hint="星级评分"
      propsHint="Props: value?, onChange?, allowHalf?, disabled?"
    >
      <DemoBlock
        title="allowHalf / value"
        code={`<RateLiquidGlass value={3} onChange={setRate} allowHalf />`}
      >
        <RateLiquidGlass value={rateValue} onChange={setRateValue} allowHalf />
      </DemoBlock>

      <DisabledDemoBlock
        component="RateLiquidGlass"
        renderDisabled={<RateLiquidGlass disabled value={2} />}
        renderEnabled={<RateLiquidGlass value={rateValue} onChange={setRateValue} />}
      />
    </DemoSection>
  )
}

export function AlertSection() {
  const alertVariants = ['default', 'primary', 'success', 'warning', 'danger'] as const

  return (
    <DemoSection
      id="alert"
      title="Alert"
      hint="语义警告条"
      propsHint="Props: variant?: default | primary | danger | success | warning, title?, glassParams?"
    >
      {alertVariants.map((variant) => (
        <DemoBlock
          key={`alert-${variant}`}
          title={`variant · ${variant}`}
          code={`<AlertLiquidGlass variant="${variant}" title="${variant}">\n  Message content.\n</AlertLiquidGlass>`}
        >
          <AlertLiquidGlass variant={variant} title={variant.charAt(0).toUpperCase() + variant.slice(1)}>
            Semantic border color for {variant} state.
          </AlertLiquidGlass>
        </DemoBlock>
      ))}

      <GlassPresetDemoBlocks
        component="AlertLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 3)}
        extraProps='variant="primary" title="Primary"'
        render={(preset) => (
          <AlertLiquidGlass glassParams={preset.params} variant="primary" title="Primary">
            Custom glass refraction on alert surface.
          </AlertLiquidGlass>
        )}
      />
    </DemoSection>
  )
}

export function ToastSection() {
  const [toastVariant, setToastVariant] = useState<'default' | 'success' | 'error' | null>(null)

  useEffect(() => {
    if (!toastVariant) return
    const timer = window.setTimeout(() => setToastVariant(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toastVariant])

  const toastVariants = ['default', 'success', 'error'] as const

  return (
    <DemoSection
      id="toast"
      title="Toast"
      hint="轻量通知"
      propsHint="Props: open?, variant?: default | success | error, title?, description?"
    >
      {toastVariants.map((variant) => (
        <DemoBlock
          key={`toast-${variant}`}
          title={`variant · ${variant}`}
          code={`<ToastLiquidGlass\n  open={open}\n  variant="${variant}"\n  title="Notification"\n  description="..."\n/>`}
        >
          <ButtonLiquidGlass size="sm" onClick={() => setToastVariant(variant)}>
            Show {variant}
          </ButtonLiquidGlass>
        </DemoBlock>
      ))}

      {toastVariant && (
        <ToastLiquidGlass
          open
          variant={toastVariant}
          title="Notification"
          description={`Toast variant="${toastVariant}"`}
        />
      )}
    </DemoSection>
  )
}

export function SpinSection() {
  return (
    <DemoSection
      id="spin"
      title="Spin"
      hint="加载指示器"
      propsHint="Props: size?, tip?, spinning?, variant?, children? (overlay)"
    >
      <SizeDemoBlock
        component="SpinLiquidGlass"
        render={(size) => <SpinLiquidGlass key={size} size={size} tip={size === 'md' ? 'Loading…' : undefined} />}
      />

      <DemoBlock
        title="overlay · children"
        code={`<SpinLiquidGlass spinning tip="Loading…">\n  <CardLiquidGlass>...</CardLiquidGlass>\n</SpinLiquidGlass>`}
      >
        <SpinLiquidGlass spinning tip="Loading…">
          <CardLiquidGlass style={{ width: 240 }}>
            <CardLiquidGlass.Header>Overlay</CardLiquidGlass.Header>
            <CardLiquidGlass.Body>Content under spin overlay.</CardLiquidGlass.Body>
          </CardLiquidGlass>
        </SpinLiquidGlass>
      </DemoBlock>

      <VariantDemoBlock
        component="SpinLiquidGlass"
        render={(variant) => <SpinLiquidGlass key={variant} variant={variant} tip={variant} />}
      />
    </DemoSection>
  )
}

export function SkeletonSection() {
  return (
    <DemoSection
      id="skeleton"
      title="Skeleton"
      hint="骨架屏占位"
      propsHint="Props: active?, avatar?, paragraph?, title?"
    >
      <DemoBlock
        title="avatar / paragraph / active"
        code={`<SkeletonLiquidGlass avatar paragraph={{ rows: 3 }} active />`}
      >
        <SkeletonLiquidGlass avatar paragraph={{ rows: 3 }} active />
      </DemoBlock>

      <DemoBlock
        title="title only"
        code={`<SkeletonLiquidGlass title paragraph={{ rows: 2 }} />`}
      >
        <SkeletonLiquidGlass title paragraph={{ rows: 2 }} />
      </DemoBlock>
    </DemoSection>
  )
}

export function ProgressSection() {
  const [progressValue] = useState(72)

  return (
    <DemoSection
      id="progress"
      title="Progress"
      hint="进度条 — track + fill 玻璃"
      propsHint="Props: value?, max?, fillGlassParams?, glassParams?"
    >
      <DemoBlock
        title="value · 25 / 50 / 75 / 100"
        code={`<ProgressLiquidGlass value={75} max={100} />`}
      >
        {[25, 50, 75, 100].map((v) => (
          <ProgressLiquidGlass key={v} value={v} style={{ width: 180 }} />
        ))}
      </DemoBlock>

      {FILL_PRESETS.map((preset) => (
        <DemoBlock
          key={`progress-fill-${preset.id}`}
          title={`fillGlassParams · ${preset.label}`}
          code={`<ProgressLiquidGlass\n  value={72}\n${fillPropsLine(preset.params)}/>`}
        >
          <ProgressLiquidGlass
            value={progressValue}
            fillGlassParams={preset.params}
            style={{ width: 220 }}
          />
        </DemoBlock>
      ))}

      <GlassPresetDemoBlocks
        component="ProgressLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 3)}
        extraProps="value={72}"
        render={(preset) => (
          <ProgressLiquidGlass
            value={progressValue}
            glassParams={preset.params}
            style={{ width: 220 }}
          />
        )}
      />
    </DemoSection>
  )
}

export function ResultSection() {
  const statuses = ['success', 'error', 'info', 'warning'] as const

  return (
    <DemoSection
      id="result"
      title="Result"
      hint="结果页 — 四种 status"
      propsHint="Props: status?: success | error | info | warning, title?, subTitle?, extra?"
    >
      {statuses.map((status) => (
        <DemoBlock
          key={`result-${status}`}
          title={`status · ${status}`}
          code={`<ResultLiquidGlass status="${status}" title="${status}" subTitle="..." />`}
        >
          <ResultLiquidGlass
            status={status}
            title={status.charAt(0).toUpperCase() + status.slice(1)}
            subTitle={`Result status="${status}"`}
            extra={<ButtonLiquidGlass size="sm">Action</ButtonLiquidGlass>}
          />
        </DemoBlock>
      ))}
    </DemoSection>
  )
}

export function PopconfirmSection() {
  return (
    <DemoSection
      id="popconfirm"
      title="Popconfirm"
      hint="确认气泡"
      propsHint="Props: title?, description?, onConfirm?, trigger?"
    >
      <DemoBlock
        title="onConfirm"
        code={`<PopconfirmLiquidGlass title="Delete?" onConfirm={...} trigger={...} />`}
      >
        <PopconfirmLiquidGlass
          title="Delete this item?"
          description="This action cannot be undone."
          onConfirm={() => {}}
          trigger={<ButtonLiquidGlass size="sm">Delete</ButtonLiquidGlass>}
        />
      </DemoBlock>
    </DemoSection>
  )
}

export function BreadcrumbSection() {
  return (
    <DemoSection
      id="breadcrumb"
      title="Breadcrumb"
      hint="面包屑导航"
      propsHint="Props: items[] — label, href?, onClick?"
    >
      <DemoBlock
        title="items · href / onClick"
        code={`<BreadcrumbLiquidGlass items={[\n  { label: 'Home', href: '/' },\n  { label: 'Components', onClick: () => {} },\n  { label: 'Current' },\n]} />`}
      >
        <BreadcrumbLiquidGlass
          items={[
            { label: 'Home', href: '#' },
            { label: 'Components', onClick: () => {} },
            { label: 'Breadcrumb' },
          ]}
        />
      </DemoBlock>
    </DemoSection>
  )
}

export function MenuSection() {
  const [menuKey, setMenuKey] = useState('home')

  return (
    <DemoSection
      id="menu"
      title="Menu"
      hint="垂直菜单"
      propsHint="Props: items[], selectedKeys?, onSelect?"
    >
      <DemoBlock
        title="selectedKeys / disabled item"
        code={`<MenuLiquidGlass items={items} selectedKeys={[key]} onSelect={setKey} />`}
      >
        <MenuLiquidGlass
          selectedKeys={[menuKey]}
          onSelect={setMenuKey}
          items={[
            { key: 'home', label: 'Home', icon: '🏠' },
            { key: 'docs', label: 'Docs', icon: '📄' },
            { key: 'settings', label: 'Settings', icon: '⚙️', disabled: true },
          ]}
        />
      </DemoBlock>
    </DemoSection>
  )
}

export function DropdownSection() {
  return (
    <DemoSection
      id="dropdown"
      title="Dropdown"
      hint="下拉菜单"
      propsHint="Props: trigger, items[] — key, label, danger?"
    >
      <DemoBlock
        title="menu items"
        code={`<DropdownLiquidGlass trigger={<Button />} items={items} />`}
      >
        <DropdownLiquidGlass
          trigger={<ButtonLiquidGlass size="sm">Dropdown</ButtonLiquidGlass>}
          items={[
            { key: '1', label: 'Profile' },
            { key: '2', label: 'Settings' },
            { key: '3', label: 'Logout', danger: true },
          ]}
        />
      </DemoBlock>
    </DemoSection>
  )
}

export function PaginationSection() {
  const [page, setPage] = useState(2)

  return (
    <DemoSection
      id="pagination"
      title="Pagination"
      hint="分页器"
      propsHint="Props: page?, totalPages?, onPageChange?"
    >
      <DemoBlock
        title="page / totalPages"
        code={`<PaginationLiquidGlass page={2} totalPages={5} onPageChange={setPage} />`}
      >
        <PaginationLiquidGlass page={page} totalPages={5} onPageChange={setPage} />
        <PaginationLiquidGlass page={1} totalPages={1} />
      </DemoBlock>
    </DemoSection>
  )
}

export function StepsSection() {
  return (
    <DemoSection
      id="steps"
      title="Steps"
      hint="步骤条 — horizontal / vertical"
      propsHint="Props: items[], current?, direction?: horizontal | vertical, variant?"
    >
      <DemoBlock
        title="direction · horizontal"
        code={`<StepsLiquidGlass current={1} items={items} />`}
      >
        <StepsLiquidGlass
          current={1}
          items={STEPS_ITEMS}
          style={{ width: '100%', maxWidth: 520 }}
        />
      </DemoBlock>

      <DemoBlock
        title="direction · vertical"
        code={`<StepsLiquidGlass direction="vertical" current={1} items={items} />`}
      >
        <StepsLiquidGlass
          direction="vertical"
          current={1}
          items={STEPS_ITEMS}
          style={{ width: 280 }}
        />
      </DemoBlock>

      <VariantDemoBlock
        component="StepsLiquidGlass"
        render={(variant) => (
          <StepsLiquidGlass
            key={variant}
            variant={variant}
            current={1}
            items={STEPS_ITEMS.slice(0, 2)}
            style={{ width: '100%', maxWidth: 420 }}
          />
        )}
      />
    </DemoSection>
  )
}

export function AnchorSection() {
  return (
    <DemoSection
      id="anchor"
      title="Anchor"
      hint="页内锚点 — 链接至各 demo section"
      propsHint="Props: links[] — key, href, title"
    >
      <DemoBlock
        title="links · demoNav section ids"
        code={`<AnchorLiquidGlass links={[{ key: 'button', href: '#button', title: 'Button' }, ...]} />`}
      >
        <AnchorLiquidGlass links={ANCHOR_LINKS} />
      </DemoBlock>
    </DemoSection>
  )
}

export function NavbarSection() {
  return (
    <DemoSection
      id="navbar"
      title="Navbar"
      hint="顶栏导航"
      propsHint="Props: brand?, glassParams?, children?"
    >
      <GlassPresetDemoBlocks
        component="NavbarLiquidGlass"
        presets={GLASS_PRESETS.slice(0, 3)}
        extraProps='brand="Brand"'
        render={(preset) => (
          <NavbarLiquidGlass brand="Liquid Glass" glassParams={preset.params} style={{ width: '100%' }}>
            <ButtonLiquidGlass size="sm">Docs</ButtonLiquidGlass>
            <IconButtonLiquidGlass aria-label="Menu">☰</IconButtonLiquidGlass>
          </NavbarLiquidGlass>
        )}
      />
    </DemoSection>
  )
}

export function DockSection() {
  return (
    <DemoSection
      id="dock"
      title="Dock"
      hint="底部 Dock — 默认 dock 圆角 preset"
      propsHint="Props: items[], glassParams?"
    >
      <GlassPresetDemoBlocks
        component="DockLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 3)}
        extraProps="items={items}"
        render={(preset) => (
          <DockLiquidGlass glassParams={preset.params} items={DOCK_ITEMS} />
        )}
      />
    </DemoSection>
  )
}

export function TabsSection() {
  const [tabValue, setTabValue] = useState('overview')

  return (
    <DemoSection
      id="tabs"
      title="Tabs"
      hint="ButtonGroup slider + 独立 panel 玻璃"
      propsHint="Props: items[], size?, glassParams?, thumbGlassParams?, panelGlassParams?, value?, onValueChange?"
    >
      <SizeDemoBlock
        component="TabsLiquidGlass"
        render={(size) => (
          <TabsLiquidGlass key={size} items={TAB_ITEMS} size={size} defaultValue="overview" />
        )}
      />

      <GlassPresetDemoBlocks
        component="TabsLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 3)}
        extraProps="items={items}"
        render={(preset) => (
          <TabsLiquidGlass items={TAB_ITEMS} glassParams={preset.params} defaultValue="overview" />
        )}
      />

      {THUMB_PRESETS.slice(1).map((preset) => (
        <DemoBlock
          key={`tabs-thumb-${preset.id}`}
          title={`thumbGlassParams · ${preset.label}`}
          code={`<TabsLiquidGlass\n${thumbPropsLine(preset.params)} items={items} />`}
        >
          <TabsLiquidGlass items={TAB_ITEMS} thumbGlassParams={preset.params} defaultValue="overview" />
        </DemoBlock>
      ))}

      {PANEL_PRESETS.map((preset) => (
        <DemoBlock
          key={`tabs-panel-${preset.id}`}
          title={`panelGlassParams · ${preset.label}`}
          description="Tab 内容面板独立玻璃"
          code={`<TabsLiquidGlass\n${panelPropsLine(preset.params)} items={items} />`}
        >
          <TabsLiquidGlass
            items={TAB_ITEMS}
            panelGlassParams={preset.params}
            defaultValue="overview"
          />
        </DemoBlock>
      ))}

      <DemoBlock
        title="controlled · value + onValueChange"
        code={`<TabsLiquidGlass\n  items={items}\n  value={value}\n  onValueChange={setValue}\n/>`}
      >
        <TabsLiquidGlass items={TAB_ITEMS} value={tabValue} onValueChange={setTabValue} />
      </DemoBlock>
    </DemoSection>
  )
}

export function SpaceSection() {
  return (
    <DemoSection
      id="space"
      title="Space"
      hint="间距布局"
      propsHint="Props: direction?, size?, wrap?"
    >
      <DemoBlock
        title="direction · horizontal / vertical"
        code={`<SpaceLiquidGlass><Button /><Button /></SpaceLiquidGlass>`}
      >
        <SpaceLiquidGlass>
          <ButtonLiquidGlass size="sm">A</ButtonLiquidGlass>
          <ButtonLiquidGlass size="sm">B</ButtonLiquidGlass>
          <ButtonLiquidGlass size="sm">C</ButtonLiquidGlass>
        </SpaceLiquidGlass>
        <SpaceLiquidGlass direction="vertical" size="sm">
          <ButtonLiquidGlass size="sm">Top</ButtonLiquidGlass>
          <ButtonLiquidGlass size="sm">Bottom</ButtonLiquidGlass>
        </SpaceLiquidGlass>
      </DemoBlock>

      <SizeDemoBlock
        component="SpaceLiquidGlass"
        render={(size) => (
          <SpaceLiquidGlass key={size} size={size}>
            <BadgeLiquidGlass size="sm">1</BadgeLiquidGlass>
            <BadgeLiquidGlass size="sm">2</BadgeLiquidGlass>
            <BadgeLiquidGlass size="sm">3</BadgeLiquidGlass>
          </SpaceLiquidGlass>
        )}
      />
    </DemoSection>
  )
}

export function DividerSection() {
  return (
    <DemoSection
      id="divider"
      title="Divider"
      hint="分隔线"
      propsHint="Props: orientation?: horizontal | vertical, glassParams?"
    >
      <DemoBlock
        title="orientation · horizontal / vertical"
        code={`<DividerLiquidGlass orientation="horizontal" />\n<DividerLiquidGlass orientation="vertical" />`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Left</span>
          <DividerLiquidGlass orientation="vertical" />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Right</span>
        </div>
        <DividerLiquidGlass orientation="horizontal" />
      </DemoBlock>

      <GlassPresetDemoBlocks
        component="DividerLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 3)}
        render={(preset) => <DividerLiquidGlass glassParams={preset.params} />}
      />
    </DemoSection>
  )
}

export function AffixSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <DemoSection
      id="affix"
      title="Affix"
      hint="滚动吸顶 / 吸底"
      propsHint="Props: offsetTop?, offsetBottom?, target?, children"
    >
      <DemoBlock
        title="offsetTop · scroll container"
        description="在下方容器内滚动，标签吸顶"
        code={`<AffixLiquidGlass offsetTop={0} target={() => scrollEl}>\n  <BadgeLiquidGlass shape="chip">Affixed</BadgeLiquidGlass>\n</AffixLiquidGlass>`}
      >
        <div
          ref={scrollRef}
          style={{
            height: 200,
            overflow: 'auto',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div style={{ height: 80, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
            Scroll down ↓
          </div>
          <AffixLiquidGlass offsetTop={0} target={() => scrollRef.current}>
            <BadgeLiquidGlass shape="chip">Affixed Header</BadgeLiquidGlass>
          </AffixLiquidGlass>
          <div style={{ height: 320, color: 'rgba(255,255,255,0.4)', fontSize: 12, paddingTop: 16 }}>
            Long content area…
          </div>
        </div>
      </DemoBlock>
    </DemoSection>
  )
}

export function ModalSection() {
  const [open, setOpen] = useState(false)

  return (
    <DemoSection
      id="modal"
      title="Modal"
      hint="对话框 — Portal + ESC + overlay"
      propsHint="Props: open?, title?, footer?, onClose?, glassParams?"
    >
      <DemoBlock
        title="open / title / footer / onClose"
        code={`<ModalLiquidGlass\n  open={open}\n  title="Glass Modal"\n  onClose={() => setOpen(false)}\n  footer={<ButtonLiquidGlass>OK</ButtonLiquidGlass>}\n>\n  Content\n</ModalLiquidGlass>`}
      >
        <ButtonLiquidGlass size="sm" onClick={() => setOpen(true)}>
          Open Modal
        </ButtonLiquidGlass>
      </DemoBlock>

      <GlassPresetDemoBlocks
        component="ModalLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 2)}
        extraProps="open={open} title='Modal'"
        render={(preset) => (
          <ButtonLiquidGlass size="sm" onClick={() => setOpen(true)}>
            Modal ({preset.label})
          </ButtonLiquidGlass>
        )}
      />

      <ModalLiquidGlass
        open={open}
        title="Glass Modal"
        onClose={() => setOpen(false)}
        footer={
          <>
            <ButtonLiquidGlass size="sm" onClick={() => setOpen(false)}>
              Cancel
            </ButtonLiquidGlass>
            <ButtonLiquidGlass size="sm" onClick={() => setOpen(false)}>
              Confirm
            </ButtonLiquidGlass>
          </>
        }
      >
        Modal dialog with liquid glass refraction. ESC 或点击遮罩关闭。
      </ModalLiquidGlass>
    </DemoSection>
  )
}

export function DrawerSection() {
  const [drawerLeftOpen, setDrawerLeftOpen] = useState(false)
  const [drawerRightOpen, setDrawerRightOpen] = useState(false)

  return (
    <DemoSection
      id="drawer"
      title="Drawer"
      hint="侧栏抽屉"
      propsHint="Props: open?, side?: left | right, title?, onClose?, glassParams?"
    >
      <DemoBlock
        title="side · left / right"
        code={`<DrawerLiquidGlass side="left" open={open} title="Left" onClose={...} />\n<DrawerLiquidGlass side="right" open={open} title="Right" onClose={...} />`}
      >
        <ButtonLiquidGlass size="sm" onClick={() => setDrawerLeftOpen(true)}>
          Left Drawer
        </ButtonLiquidGlass>
        <ButtonLiquidGlass size="sm" onClick={() => setDrawerRightOpen(true)}>
          Right Drawer
        </ButtonLiquidGlass>
      </DemoBlock>

      <DrawerLiquidGlass
        open={drawerLeftOpen}
        side="left"
        title="Left Drawer"
        onClose={() => setDrawerLeftOpen(false)}
      >
        <p>side=&quot;left&quot; 从左侧滑入</p>
        <ButtonLiquidGlass size="sm" onClick={() => setDrawerLeftOpen(false)}>
          Close
        </ButtonLiquidGlass>
      </DrawerLiquidGlass>

      <DrawerLiquidGlass
        open={drawerRightOpen}
        side="right"
        title="Right Drawer"
        onClose={() => setDrawerRightOpen(false)}
      >
        <p>side=&quot;right&quot; 从右侧滑入</p>
        <ButtonLiquidGlass size="sm" onClick={() => setDrawerRightOpen(false)}>
          Close
        </ButtonLiquidGlass>
      </DrawerLiquidGlass>
    </DemoSection>
  )
}

export function PopoverSection() {
  return (
    <DemoSection
      id="popover"
      title="Popover"
      hint="弹出层"
      propsHint="Props: trigger, content, glassParams?"
    >
      <GlassPresetDemoBlocks
        component="PopoverLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 3)}
        render={(preset) => (
          <PopoverLiquidGlass
            glassParams={preset.params}
            trigger={<ButtonLiquidGlass size="sm">Popover</ButtonLiquidGlass>}
            content={`${preset.label} popover content.`}
          />
        )}
      />
    </DemoSection>
  )
}

export function TooltipSection() {
  return (
    <DemoSection
      id="tooltip"
      title="Tooltip"
      hint="文字提示"
      propsHint="Props: content, children, glassParams?"
    >
      <GlassPresetDemoBlocks
        component="TooltipLiquidGlass"
        presets={GLASS_PRESETS.slice(1, 3)}
        render={(preset) => (
          <TooltipLiquidGlass glassParams={preset.params} content={`${preset.label} tooltip`}>
            <ButtonLiquidGlass size="sm">Hover</ButtonLiquidGlass>
          </TooltipLiquidGlass>
        )}
      />
    </DemoSection>
  )
}

export const DEMO_SECTIONS: { id: string; Component: () => JSX.Element }[] = [
  { id: 'button', Component: ButtonSection },
  { id: 'button-group', Component: ButtonGroupSection },
  { id: 'icon-button', Component: IconButtonSection },
  { id: 'float-button', Component: FloatButtonSection },
  { id: 'badge', Component: BadgeSection },
  { id: 'tag', Component: TagSection },
  { id: 'avatar', Component: AvatarSection },
  { id: 'avatar-group', Component: AvatarGroupSection },
  { id: 'card', Component: CardSection },
  { id: 'media-card', Component: MediaCardSection },
  { id: 'list', Component: ListSection },
  { id: 'empty', Component: EmptySection },
  { id: 'statistic', Component: StatisticSection },
  { id: 'timeline', Component: TimelineSection },
  { id: 'collapse', Component: CollapseSection },
  { id: 'typography', Component: TypographySection },
  { id: 'input', Component: InputSection },
  { id: 'textarea', Component: TextareaSection },
  { id: 'select', Component: SelectSection },
  { id: 'checkbox', Component: CheckboxSection },
  { id: 'radio', Component: RadioSection },
  { id: 'switch', Component: SwitchSection },
  { id: 'slider', Component: SliderSection },
  { id: 'rate', Component: RateSection },
  { id: 'alert', Component: AlertSection },
  { id: 'toast', Component: ToastSection },
  { id: 'spin', Component: SpinSection },
  { id: 'skeleton', Component: SkeletonSection },
  { id: 'progress', Component: ProgressSection },
  { id: 'result', Component: ResultSection },
  { id: 'popconfirm', Component: PopconfirmSection },
  { id: 'breadcrumb', Component: BreadcrumbSection },
  { id: 'menu', Component: MenuSection },
  { id: 'dropdown', Component: DropdownSection },
  { id: 'pagination', Component: PaginationSection },
  { id: 'steps', Component: StepsSection },
  { id: 'anchor', Component: AnchorSection },
  { id: 'navbar', Component: NavbarSection },
  { id: 'dock', Component: DockSection },
  { id: 'tabs', Component: TabsSection },
  { id: 'space', Component: SpaceSection },
  { id: 'divider', Component: DividerSection },
  { id: 'affix', Component: AffixSection },
  { id: 'modal', Component: ModalSection },
  { id: 'drawer', Component: DrawerSection },
  { id: 'popover', Component: PopoverSection },
  { id: 'tooltip', Component: TooltipSection },
]
