export interface DemoNavItem {
  id: string
  label: string
}

export interface DemoNavGroup {
  title: string
  items: DemoNavItem[]
}

export const DEMO_NAV: DemoNavGroup[] = [
  {
    title: '全局',
    items: [{ id: 'theme', label: 'Provider 主题' }],
  },
  {
    title: '基础',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'button-group', label: 'Button Group' },
      { id: 'badge', label: 'Badge & Icon' },
    ],
  },
  {
    title: '表单',
    items: [{ id: 'form', label: 'Input & Controls' }],
  },
  {
    title: '容器',
    items: [
      { id: 'card', label: 'Card & Media' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'list', label: 'List & Avatar' },
    ],
  },
  {
    title: '导航',
    items: [{ id: 'navigation', label: 'Navbar & Dock' }],
  },
  {
    title: '浮层',
    items: [{ id: 'overlay', label: 'Modal & Feedback' }],
  },
]

export const DEMO_NAV_ITEMS = DEMO_NAV.flatMap((group) => group.items)
