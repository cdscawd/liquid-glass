# Liquid Glass

<div align="center">

**基于 SVG 位移折射的动态背景液态玻璃 React 组件库**

[English Documentation](./README.md)

</div>

---

## 目录

- [简介](#简介)
- [特性](#特性)
- [快速开始](#快速开始)
- [在项目中使用](#在项目中使用)
- [交互演示](#交互演示)
- [核心 API](#核心-api)
- [组件用法](#组件用法)
  - [全局主题](#全局主题-liquidglassprovider)
  - [通用](#通用)
  - [数据展示](#数据展示)
  - [数据录入](#数据录入)
  - [反馈](#反馈)
  - [导航](#导航)
  - [布局](#布局)
  - [浮层](#浮层)
  - [背景](#背景)
- [高级玻璃参数](#高级玻璃参数)
- [组件速查表](#组件速查表)
- [命名约定](#命名约定)
- [性能说明](#性能说明)
- [浏览器支持](#浏览器支持)
- [项目结构](#项目结构)
- [新增组件](#新增组件)

---

## 简介

Liquid Glass 是一套 **React 19** UI 组件库，在网页上复现 Apple 风格的液态玻璃折射效果。所有 `*LiquidGlass` 组件共用同一套渲染管线：

**SDF 位移贴图 → SVG `feDisplacementMap` → `backdrop-filter`**

组件设计用于叠加在丰富的动态背景之上（仓库内置 **Three.js 赛博隧道** 演示）。交互式 Demo 覆盖 **52 个导出组件**，支持实时调节 `glassParams` 与可展开的源码示例。

---

## 特性

- 统一折射管线 `useLiquidGlassEffect`，组件内不重复实现滤镜逻辑
- 52 个组件：按钮、表单、导航、浮层、数据展示、反馈等
- `LiquidGlassProvider` 全局换肤
- 语义变体：`default` · `primary` · `danger` · `success`
- 形状预设：`GLASS_SHAPE.default` · `pill` · `dock` · `badge`
- 次级玻璃层：`thumbGlassParams`、`fillGlassParams`、`panelGlassParams`、`dropdownGlassParams`
- 交互式演示：侧边栏导航、Intersection 区块追踪、分区源码展示

---

## 快速开始

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

| 命令 | 说明 |
|------|------|
| `dev` | 启动 Vite 开发服务（自动打开浏览器） |
| `build` | TypeScript 检查 + 生产构建 |
| `preview` | 预览生产构建产物 |
| `lint` | 运行 oxlint |

---

## 在项目中使用

本仓库是 **组件库 + 演示应用**。从 `src/components` 导入，并引入全局样式：

```tsx
// main.tsx
import './styles/global.scss'
```

最小示例：

```tsx
import { LiquidGlassProvider } from './lib/liquid-glass'
import { ButtonLiquidGlass, CardLiquidGlass } from './components'
import { CyberspaceBackground } from './components/CyberspaceBackground'

export function App() {
  return (
    <>
      {/* 玻璃组件需叠加在非纯色背景上，折射效果更明显 */}
      <CyberspaceBackground />

      <LiquidGlassProvider glassParams={{ borderRadius: 8, strength: 1, edgeFalloff: 14 }}>
        <CardLiquidGlass>
          <CardLiquidGlass.Body>
            <ButtonLiquidGlass variant="primary">开始使用</ButtonLiquidGlass>
          </CardLiquidGlass.Body>
        </CardLiquidGlass>
      </LiquidGlassProvider>
    </>
  )
}
```

> **提示：** 折射依赖组件**背后**可见的内容；若背景为纯色，视觉上更接近磨砂玻璃而非液态折射。

---

## 交互演示

运行 `npm run dev` 后打开 Demo 页面，左侧导航按分类列出全部组件：

| 分类 | 包含组件 |
|------|----------|
| 全局 | Provider 主题切换 |
| 通用 | Button、Button Group、Icon Button、Float Button |
| 数据展示 | Badge、Tag、Avatar、Card、List、Timeline… |
| 数据录入 | Input、Select、Switch、Slider、Rate… |
| 反馈 | Alert、Toast、Spin、Progress、Result… |
| 导航 | Breadcrumb、Menu、Tabs、Dock、Navbar… |
| 布局 | Space、Divider、Affix |
| 浮层 | Modal、Drawer、Popover、Tooltip |

每个区块可展开查看 **Props 说明** 与 **示例代码**，并支持切换 `glassParams` 预设观察折射变化。

---

## 核心 API

### 通用 Props（大多数玻璃宿主）

| 属性 | 类型 | 说明 |
|------|------|------|
| `glassParams` | `LiquidGlassParams` | 单实例折射参数覆盖 |
| `variant` | `LiquidGlassVariant` | 语义色：`default` \| `primary` \| `danger` \| `success` |
| `size` | `'sm' \| 'md' \| 'lg'` | 尺寸变体（支持的组件） |
| `className` | `string` | 附加 CSS 类名 |
| `style` | `CSSProperties` | 与滤镜样式合并的内联样式 |

适用时透传原生 HTML 属性（`onClick`、`disabled`、`placeholder` 等）。

### `LiquidGlassParams`

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `borderRadius` | `number` | `8` | 圆角（px），胶囊形使用 `GLASS_SHAPE.pill`（`999`） |
| `strength` | `number` | `1` | 折射强度（约 `0–1`；滑动 thumb 常用 `1.15`） |
| `edgeFalloff` | `number` | 短边约 18% | 边缘扭曲带宽度（px） |

**合并优先级：**

```
component.glassParams → useLiquidGlassEffect preset → LiquidGlassProvider → DEFAULT_GLASS_PARAMS
```

### 形状预设（`GLASS_SHAPE`）

```tsx
import { GLASS_SHAPE } from './lib/liquid-glass'

GLASS_SHAPE.default  // 8
GLASS_SHAPE.pill     // 999 — Avatar、Switch 轨道、Badge chip
GLASS_SHAPE.dock     // 24 — DockLiquidGlass
GLASS_SHAPE.badge    // 6  — BadgeLiquidGlass
```

### 语义变体（Variant）

通过 CSS 修饰类应用（如 `button-liquid-glass--primary`）。颜色定义在 `src/styles/_variables.scss`（`$glass-variant-*`）。

---

## 组件用法

所有组件从 `src/components/index.ts` 导出。

### 全局主题 (`LiquidGlassProvider`)

为未单独传参的子组件注入默认 `glassParams` 与 `variant`。

```tsx
import { LiquidGlassProvider } from './lib/liquid-glass'

<LiquidGlassProvider
  glassParams={{ borderRadius: 12, strength: 1.35, edgeFalloff: 20 }}
  variant="primary"
>
  <App />
</LiquidGlassProvider>
```

在子组件中读取默认值：

```tsx
import { useLiquidGlassDefaults } from './lib/liquid-glass'

const defaults = useLiquidGlassDefaults()
```

---

### 通用

#### `ButtonLiquidGlass`

标准玻璃按钮。

```tsx
<ButtonLiquidGlass variant="primary" size="md" onClick={() => {}}>
  提交
</ButtonLiquidGlass>

<ButtonLiquidGlass variant="danger" disabled>
  禁用
</ButtonLiquidGlass>
```

| 属性 | 类型 | 说明 |
|------|------|------|
| `variant` | `LiquidGlassVariant` | 语义色 |
| `size` | `'sm' \| 'md' \| 'lg'` | 默认 `md` |
| `glassParams` | `LiquidGlassParams` | 覆盖折射参数 |

#### `ButtonGroupLiquidGlass`

分段控制 — `default`（选中项高亮）或 `slider`（可拖拽 thumb）。

```tsx
// default 变体
<ButtonGroupLiquidGlass value={tab} onValueChange={setTab} name="tabs">
  <ButtonGroupLiquidGlass.Item value="a">标签 A</ButtonGroupLiquidGlass.Item>
  <ButtonGroupLiquidGlass.Item value="b">标签 B</ButtonGroupLiquidGlass.Item>
</ButtonGroupLiquidGlass>

// slider 变体 + thumb 折射
<ButtonGroupLiquidGlass
  variant="slider"
  defaultValue="list"
  thumbGlassParams={{ strength: 1.15 }}
>
  <ButtonGroupLiquidGlass.Item value="grid">网格</ButtonGroupLiquidGlass.Item>
  <ButtonGroupLiquidGlass.Item value="list">列表</ButtonGroupLiquidGlass.Item>
</ButtonGroupLiquidGlass>
```

| 属性 | 类型 | 说明 |
|------|------|------|
| `variant` | `'default' \| 'slider'` | slider 支持拖拽吸附 |
| `value` / `defaultValue` | `string` | 当前选中值 |
| `onValueChange` | `(value: string) => void` | 变更回调 |
| `thumbGlassParams` | `LiquidGlassParams` | 仅 slider 模式 |

#### `IconButtonLiquidGlass`

圆形图标按钮。**必须提供 `aria-label`。**

```tsx
<IconButtonLiquidGlass size="md" aria-label="设置" onClick={() => {}}>
  ⚙️
</IconButtonLiquidGlass>
```

#### `FloatButtonLiquidGlass`

固定于视口右下角的悬浮按钮。

```tsx
<FloatButtonLiquidGlass
  icon="↑"
  aria-label="返回顶部"
  shape="circle"
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
/>
```

| 属性 | 类型 | 说明 |
|------|------|------|
| `shape` | `'circle' \| 'square'` | 默认 `circle` |
| `icon` | `ReactNode` | 图标内容 |
| `description` | `ReactNode` | 图标下方可选文字 |

---

### 数据展示

#### `BadgeLiquidGlass` / `TagLiquidGlass`

```tsx
<BadgeLiquidGlass shape="badge" size="sm">Beta</BadgeLiquidGlass>
<BadgeLiquidGlass shape="chip">新</BadgeLiquidGlass>

<TagLiquidGlass color="success" closable onClose={() => {}}>React</TagLiquidGlass>
<TagLiquidGlass variant="primary">精选</TagLiquidGlass>
```

| 组件 | 关键属性 |
|------|----------|
| `BadgeLiquidGlass` | `shape`: `badge` \| `chip` |
| `TagLiquidGlass` | `color` / `variant`、`closable`、`onClose` |

#### `AvatarLiquidGlass` / `AvatarGroupLiquidGlass`

```tsx
<AvatarLiquidGlass size="lg" src="/avatar.jpg" alt="用户" />
<AvatarLiquidGlass fallback="LG" glassParams={{ strength: 1.2 }} />

<AvatarGroupLiquidGlass max={3}>
  <AvatarLiquidGlass fallback="A" size="sm" />
  <AvatarLiquidGlass fallback="B" size="sm" />
  <AvatarLiquidGlass fallback="C" size="sm" />
</AvatarGroupLiquidGlass>
```

#### `CardLiquidGlass`

复合卡片，含 Header / Body / Footer 子组件。

```tsx
<CardLiquidGlass size="md" glassParams={{ borderRadius: 12 }}>
  <CardLiquidGlass.Header>标题</CardLiquidGlass.Header>
  <CardLiquidGlass.Body>正文内容</CardLiquidGlass.Body>
  <CardLiquidGlass.Footer>
    <ButtonLiquidGlass size="sm">操作</ButtonLiquidGlass>
  </CardLiquidGlass.Footer>
</CardLiquidGlass>
```

#### `MediaCardLiquidGlass`

封装 Card，支持 `image`、`title`、`description`、`footer`。

```tsx
<MediaCardLiquidGlass
  title="项目 Alpha"
  description="液态玻璃 UI 组件库"
  footer={<BadgeLiquidGlass shape="chip">新</BadgeLiquidGlass>}
  style={{ width: 280 }}
/>
```

#### `ListLiquidGlass`

单容器单滤镜，行内选中高亮。**整列表共用一个 filter。**

```tsx
<ListLiquidGlass
  items={[
    { id: '1', title: '条目 1', description: '详情', selected: true, onClick: () => {} },
    { id: '2', title: '条目 2', disabled: true },
  ]}
/>
```

#### `EmptyLiquidGlass`

```tsx
<EmptyLiquidGlass description="暂无数据">
  <ButtonLiquidGlass size="sm">创建</ButtonLiquidGlass>
</EmptyLiquidGlass>
```

#### `StatisticLiquidGlass`

```tsx
<StatisticLiquidGlass title="活跃用户" value={112893} suffix="人" />
```

#### `TimelineLiquidGlass`

```tsx
<TimelineLiquidGlass
  mode="left"
  items={[
    { key: '1', label: '2024-01', children: '项目启动', color: 'success' },
    { key: '2', label: '2024-06', children: '发布 v1.0' },
  ]}
/>
```

| 属性 | 类型 | 说明 |
|------|------|------|
| `mode` | `'left' \| 'alternate'` | 布局模式 |
| `items[].color` | `'default' \| 'success' \| 'warning' \| 'error'` | 节点颜色 |

#### `CollapseLiquidGlass`

```tsx
<CollapseLiquidGlass
  accordion
  defaultActiveKeys={['1']}
  items={[
    { key: '1', label: '章节 1', children: '内容…' },
    { key: '2', label: '章节 2', children: '更多内容…' },
  ]}
/>
```

#### `TypographyLiquidGlass`

非玻璃文字组件，用于深色背景上的排版。

```tsx
<TypographyLiquidGlass.Title level={2}>标题</TypographyLiquidGlass.Title>
<TypographyLiquidGlass.Paragraph>正文段落。</TypographyLiquidGlass.Paragraph>
<TypographyLiquidGlass.Text type="success" strong>成功</TypographyLiquidGlass.Text>
<TypographyLiquidGlass.Text type="danger" delete>已删除</TypographyLiquidGlass.Text>
```

---

### 数据录入

#### `InputLiquidGlass` / `TextareaLiquidGlass`

外层玻璃 div 包裹透明原生输入框。

```tsx
<InputLiquidGlass placeholder="搜索…" size="md" style={{ minWidth: 200 }} />
<TextareaLiquidGlass rows={4} placeholder="备注…" />
```

#### `SelectLiquidGlass`

自定义下拉，面板通过 Portal 渲染。

```tsx
<SelectLiquidGlass
  defaultValue="react"
  placeholder="选择框架"
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ]}
  onChange={(e) => console.log(e.target.value)}
  dropdownGlassParams={{ strength: 1.1 }}
/>
```

#### `CheckboxLiquidGlass`

```tsx
<CheckboxLiquidGlass label="同意条款" defaultChecked onCheckedChange={(v) => {}} />
```

#### `RadioLiquidGlass` + `RadioLiquidGlassGroup`

```tsx
<RadioLiquidGlassGroup value={value} onValueChange={setValue} size="md">
  <RadioLiquidGlass value="a" label="选项 A" />
  <RadioLiquidGlass value="b" label="选项 B" />
  <RadioLiquidGlass value="c" label="选项 C" disabled />
</RadioLiquidGlassGroup>
```

#### `SwitchLiquidGlass`

点击或拖拽 thumb 切换。thumb 仅用 SCSS，不嵌套 backdrop-filter。

```tsx
<SwitchLiquidGlass
  checked={on}
  onCheckedChange={setOn}
  size="md"
  thumbGlassParams={{ strength: 1.15 }}
/>
```

#### `SliderLiquidGlass`

原生 range + 玻璃轨道。

```tsx
<SliderLiquidGlass
  value={value}
  min={0}
  max={100}
  onChange={(e) => setValue(Number(e.target.value))}
  style={{ width: 220 }}
/>
```

#### `RateLiquidGlass`

```tsx
<RateLiquidGlass value={rating} onChange={setRating} allowHalf />
```

---

### 反馈

#### `AlertLiquidGlass`

```tsx
<AlertLiquidGlass variant="primary" title="提示">
  各 variant 对应不同语义边框色。
</AlertLiquidGlass>
```

变体：`default` · `primary` · `success` · `warning` · `danger`

#### `ToastLiquidGlass`

Portal 通知，通过 `open` 控制显隐。

```tsx
{show && (
  <ToastLiquidGlass
    open
    variant="success"
    title="已保存"
    description="更改已成功保存。"
  />
)}
```

#### `SpinLiquidGlass`

```tsx
<SpinLiquidGlass spinning tip="加载中…">
  <CardLiquidGlass>被遮罩覆盖的内容</CardLiquidGlass>
</SpinLiquidGlass>
```

#### `SkeletonLiquidGlass`

```tsx
<SkeletonLiquidGlass avatar title paragraph={{ rows: 3 }} active />
```

#### `ProgressLiquidGlass`

轨道 + 填充条双层玻璃。

```tsx
<ProgressLiquidGlass
  value={72}
  max={100}
  fillGlassParams={{ strength: 1.1 }}
  style={{ width: 220 }}
/>
```

#### `ResultLiquidGlass`

```tsx
<ResultLiquidGlass
  status="success"
  title="完成"
  subTitle="操作已成功。"
  extra={<ButtonLiquidGlass size="sm">继续</ButtonLiquidGlass>}
/>
```

状态：`success` · `error` · `info` · `warning`

#### `PopconfirmLiquidGlass`

```tsx
<PopconfirmLiquidGlass
  title="确认删除？"
  description="此操作不可撤销。"
  onConfirm={() => handleDelete()}
  trigger={<ButtonLiquidGlass variant="danger" size="sm">删除</ButtonLiquidGlass>}
/>
```

---

### 导航

#### `BreadcrumbLiquidGlass`

```tsx
<BreadcrumbLiquidGlass
  items={[
    { label: '首页', href: '/' },
    { label: '组件', onClick: () => {} },
    { label: '按钮' },
  ]}
/>
```

#### `MenuLiquidGlass`

```tsx
<MenuLiquidGlass
  selectedKeys={[key]}
  onSelect={setKey}
  items={[
    { key: 'home', label: '首页', icon: '🏠' },
    { key: 'docs', label: '文档', icon: '📄', disabled: true },
  ]}
/>
```

#### `DropdownLiquidGlass`

```tsx
<DropdownLiquidGlass
  trigger={<ButtonLiquidGlass size="sm">菜单</ButtonLiquidGlass>}
  items={[
    { key: '1', label: '个人资料' },
    { key: '2', label: '退出', danger: true },
  ]}
/>
```

#### `PaginationLiquidGlass`

```tsx
<PaginationLiquidGlass page={page} totalPages={10} onPageChange={setPage} />
```

#### `StepsLiquidGlass`

```tsx
<StepsLiquidGlass
  current={1}
  direction="horizontal"
  items={[
    { title: '已完成', description: '步骤 1' },
    { title: '进行中', description: '步骤 2' },
    { title: '等待中', description: '步骤 3' },
  ]}
/>
```

#### `AnchorLiquidGlass`

页内锚点导航。

```tsx
<AnchorLiquidGlass
  links={[
    { key: 'intro', href: '#intro', title: '介绍' },
    { key: 'api', href: '#api', title: 'API' },
  ]}
/>
```

#### `NavbarLiquidGlass`

```tsx
<NavbarLiquidGlass brand="Liquid Glass">
  <ButtonLiquidGlass size="sm">文档</ButtonLiquidGlass>
  <IconButtonLiquidGlass aria-label="菜单">☰</IconButtonLiquidGlass>
</NavbarLiquidGlass>
```

#### `DockLiquidGlass`

底部 Dock，默认使用 `GLASS_SHAPE.dock` 圆角。

```tsx
<DockLiquidGlass
  items={[
    { id: 'home', label: '首页', icon: '🏠' },
    { id: 'search', label: '搜索', icon: '🔍' },
  ]}
/>
```

#### `TabsLiquidGlass`

ButtonGroup slider + 各 Tab 独立玻璃面板。

```tsx
const items = [
  { value: 'a', label: '标签 A', content: <p>面板 A</p> },
  { value: 'b', label: '标签 B', content: <p>面板 B</p> },
]

<TabsLiquidGlass
  items={items}
  value={tab}
  onValueChange={setTab}
  panelGlassParams={{ borderRadius: 12 }}
  thumbGlassParams={{ strength: 1.15 }}
/>
```

---

### 布局

#### `SpaceLiquidGlass`

Flex 间距容器（非玻璃表面）。

```tsx
<SpaceLiquidGlass size="md" wrap>
  <ButtonLiquidGlass size="sm">A</ButtonLiquidGlass>
  <ButtonLiquidGlass size="sm">B</ButtonLiquidGlass>
</SpaceLiquidGlass>

<SpaceLiquidGlass direction="vertical" size="sm" align="center">
  <BadgeLiquidGlass>上</BadgeLiquidGlass>
  <BadgeLiquidGlass>下</BadgeLiquidGlass>
</SpaceLiquidGlass>
```

#### `DividerLiquidGlass`

```tsx
<DividerLiquidGlass orientation="horizontal" />
<DividerLiquidGlass orientation="vertical" />
```

#### `AffixLiquidGlass`

在指定滚动容器内吸顶/吸底。

```tsx
const scrollRef = useRef<HTMLDivElement>(null)

<div ref={scrollRef} style={{ height: 200, overflow: 'auto' }}>
  <AffixLiquidGlass offsetTop={0} target={() => scrollRef.current}>
    <BadgeLiquidGlass shape="chip">吸顶</BadgeLiquidGlass>
  </AffixLiquidGlass>
  {/* 长内容 */}
</div>
```

---

### 浮层

#### `ModalLiquidGlass`

Portal 对话框。按 **Esc** 或点击遮罩关闭。

```tsx
<ModalLiquidGlass
  open={open}
  title="确认"
  onClose={() => setOpen(false)}
  footer={
    <>
      <ButtonLiquidGlass size="sm" onClick={() => setOpen(false)}>取消</ButtonLiquidGlass>
      <ButtonLiquidGlass size="sm" variant="primary" onClick={handleOk}>确定</ButtonLiquidGlass>
    </>
  }
>
  对话框正文。
</ModalLiquidGlass>
```

#### `DrawerLiquidGlass`

```tsx
<DrawerLiquidGlass
  open={open}
  side="right"
  title="设置"
  onClose={() => setOpen(false)}
>
  抽屉内容。
</DrawerLiquidGlass>
```

`side`：`left` | `right`

#### `PopoverLiquidGlass`

```tsx
<PopoverLiquidGlass
  trigger={<ButtonLiquidGlass size="sm">详情</ButtonLiquidGlass>}
  content="弹出层正文。"
/>
```

#### `TooltipLiquidGlass`

```tsx
<TooltipLiquidGlass content="提示文字">
  <ButtonLiquidGlass size="sm">悬停</ButtonLiquidGlass>
</TooltipLiquidGlass>
```

---

### 背景

#### `CyberspaceBackground`

Three.js 隧道 + 粒子场景。非玻璃组件，用作演示背景。

```tsx
import { CyberspaceBackground } from './components/CyberspaceBackground'

<CyberspaceBackground />
```

---

## 高级玻璃参数

部分组件支持次级玻璃层：

| 属性 | 适用组件 | 用途 |
|------|----------|------|
| `thumbGlassParams` | `ButtonGroupLiquidGlass`（slider）、`SwitchLiquidGlass`、`TabsLiquidGlass` | 滑动 thumb 折射强度 |
| `fillGlassParams` | `ProgressLiquidGlass` | 进度填充条玻璃 |
| `panelGlassParams` | `TabsLiquidGlass` | Tab 内容面板玻璃 |
| `dropdownGlassParams` | `SelectLiquidGlass` | 下拉面板玻璃 |

示例：

```tsx
<ProgressLiquidGlass
  value={80}
  glassParams={{ borderRadius: 8 }}
  fillGlassParams={{ strength: 1.1, edgeFalloff: 10 }}
/>
```

相关常量：

```tsx
import { DEFAULT_THUMB_STRENGTH, DEFAULT_FILL_STRENGTH_MULTIPLIER } from './lib/liquid-glass'
```

---

## 组件速查表

| 分类 | 组件 | 是否有 `size` | 备注 |
|------|------|:-------------:|------|
| 通用 | `ButtonLiquidGlass` | ✓ | `variant` 语义色 |
| 通用 | `ButtonGroupLiquidGlass` | ✓ | `slider` 模式支持 `thumbGlassParams` |
| 通用 | `IconButtonLiquidGlass` | ✓ | 需 `aria-label` |
| 通用 | `FloatButtonLiquidGlass` | — | 固定右下角 FAB |
| 展示 | `BadgeLiquidGlass` | ✓ | `shape`: badge / chip |
| 展示 | `TagLiquidGlass` | ✓ | `closable` 可关闭 |
| 展示 | `AvatarLiquidGlass` | ✓ | preset pill |
| 展示 | `AvatarGroupLiquidGlass` | — | `max` 限制显示数量 |
| 展示 | `CardLiquidGlass` | ✓ | Header / Body / Footer |
| 展示 | `MediaCardLiquidGlass` | ✓ | 封装 Card |
| 展示 | `ListLiquidGlass` | — | 单 filter 容器 |
| 展示 | `EmptyLiquidGlass` | — | 空状态 |
| 展示 | `StatisticLiquidGlass` | — | 数值统计 |
| 展示 | `TimelineLiquidGlass` | — | left / alternate |
| 展示 | `CollapseLiquidGlass` | — | `accordion` 手风琴 |
| 展示 | `TypographyLiquidGlass` | — | 非玻璃排版 |
| 录入 | `InputLiquidGlass` | ✓ | 透明原生 input |
| 录入 | `TextareaLiquidGlass` | ✓ | 透明原生 textarea |
| 录入 | `SelectLiquidGlass` | ✓ | `dropdownGlassParams` |
| 录入 | `CheckboxLiquidGlass` | ✓ | — |
| 录入 | `RadioLiquidGlass` | ✓ | 配合 Group 使用 |
| 录入 | `SwitchLiquidGlass` | ✓ | 拖拽吸附 |
| 录入 | `SliderLiquidGlass` | — | track-only 玻璃 |
| 录入 | `RateLiquidGlass` | — | `allowHalf` |
| 反馈 | `AlertLiquidGlass` | — | 5 种 variant |
| 反馈 | `ToastLiquidGlass` | — | Portal 通知 |
| 反馈 | `SpinLiquidGlass` | ✓ | 可包裹 children |
| 反馈 | `SkeletonLiquidGlass` | — | 骨架屏 |
| 反馈 | `ProgressLiquidGlass` | — | `fillGlassParams` |
| 反馈 | `ResultLiquidGlass` | — | 4 种 status |
| 反馈 | `PopconfirmLiquidGlass` | — | 确认气泡 |
| 导航 | `BreadcrumbLiquidGlass` | — | — |
| 导航 | `MenuLiquidGlass` | — | 垂直菜单 |
| 导航 | `DropdownLiquidGlass` | — | — |
| 导航 | `PaginationLiquidGlass` | — | — |
| 导航 | `StepsLiquidGlass` | — | horizontal / vertical |
| 导航 | `AnchorLiquidGlass` | — | 页内锚点 |
| 导航 | `NavbarLiquidGlass` | — | 顶栏 |
| 导航 | `DockLiquidGlass` | — | dock 圆角 preset |
| 导航 | `TabsLiquidGlass` | ✓ | `panelGlassParams` |
| 布局 | `SpaceLiquidGlass` | — | 非玻璃间距 |
| 布局 | `DividerLiquidGlass` | — | horizontal / vertical |
| 布局 | `AffixLiquidGlass` | — | 滚动吸顶 |
| 浮层 | `ModalLiquidGlass` | — | Esc 关闭 |
| 浮层 | `DrawerLiquidGlass` | — | left / right |
| 浮层 | `PopoverLiquidGlass` | — | — |
| 浮层 | `TooltipLiquidGlass` | — | — |
| 背景 | `CyberspaceBackground` | — | Three.js，非玻璃 |

---

## 命名约定

| 层级 | 规则 | 示例 |
|------|------|------|
| 组件 | 语义名 + `LiquidGlass` | `CardLiquidGlass` |
| Props | `<Name>LiquidGlassProps` | `CardLiquidGlassProps` |
| 尺寸 | `'sm' \| 'md' \| 'lg'`（适用时） | `ButtonLiquidGlass` |
| CSS 类 | `<kebab>-liquid-glass` | `card-liquid-glass--sm` |

新增玻璃宿主 **必须** 使用 `useLiquidGlassEffect`，禁止在组件内复制 `generateDisplacementMap` 或 `LiquidGlassFilter`。

---

## 性能说明

- **一个宿主 = 一个 SVG 滤镜** — 每个 `useLiquidGlassEffect` 实例独立持有滤镜
- **列表单容器** — `ListLiquidGlass` 整表一个 filter，禁止每行独立滤镜
- **避免嵌套 `backdrop-filter`** — Switch thumb 仅用 SCSS
- 位移贴图在钩子内防抖，通过 `requestIdleCallback` 调度生成
- `glass-surface` mixin 设置 `contain: layout style paint` + `isolation: isolate`

---

## 浏览器支持

折射效果建议在 **Chrome** 及 Chromium 内核浏览器中查看。Firefox、Safari 中 `backdrop-filter` 与 SVG 滤镜组合的表现可能不一致。

---

## 项目结构

```
src/
├── lib/liquid-glass/       # 共享算法与钩子
│   ├── constants.ts        # DEFAULT_GLASS_PARAMS、GLASS_SHAPE…
│   ├── useLiquidGlassEffect.ts
│   ├── LiquidGlassFilter.tsx
│   └── LiquidGlassProvider.tsx
├── styles/                 # SCSS 变量与 glass mixins
├── components/             # *LiquidGlass 组件
├── engine/                 # Three.js 背景引擎
├── demo/                   # 交互演示（DemoShowcase、DemoSections）
└── App.tsx
```

---

## 新增组件

1. 查阅 [组件用法](#组件用法) — 优先扩展现有组件。
2. 创建 `src/components/XxxLiquidGlass/`（`.tsx`、`.scss`、`index.ts`）。
3. 接入 `useLiquidGlassEffect` 及正确的 `GLASS_SHAPE` preset。
4. 在 `components/index.ts` 导出。
5. 在 `demo/DemoSections.tsx` 添加演示，并在 `demo/demoNav.ts` 注册导航。
6. 执行 `npm run build` 验证。

完整规范见 `.cursor/rules/liquid-glass-components.mdc`。

---

<div align="center">

[English Documentation](./README.md)

</div>
