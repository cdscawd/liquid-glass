import type { LiquidGlassParams } from '../lib/liquid-glass'

export interface DemoButtonConfig {
  id: string
  label: string
  size?: 'sm' | 'md' | 'lg'
  glassParams?: LiquidGlassParams
}

export const DEMO_BUTTONS: DemoButtonConfig[] = [
  { id: 'default', label: 'Default', glassParams: {} },
  { id: 'strong', label: 'Strong Lens', glassParams: { strength: 1.45, edgeFalloff: 20 } },
  { id: 'subtle', label: 'Subtle Glass', glassParams: { strength: 0.45, edgeFalloff: 7 } },
  { id: 'wide', label: 'Wide Edge', glassParams: { strength: 1, edgeFalloff: 24 } },
  { id: 'narrow', label: 'Narrow Edge', glassParams: { strength: 1.2, edgeFalloff: 6 } },
  {
    id: 'sharp',
    label: 'Sharp Corner',
    glassParams: { borderRadius: 4, strength: 1.15, edgeFalloff: 10 },
  },
  { id: 'pill', label: 'Pill Shape', glassParams: { borderRadius: 999, strength: 1, edgeFalloff: 14 } },
  {
    id: 'soft',
    label: 'Soft Round',
    glassParams: { borderRadius: 16, strength: 0.85, edgeFalloff: 16 },
  },
  { id: 'sm', label: 'Small', size: 'sm', glassParams: { strength: 1.3, edgeFalloff: 5 } },
  { id: 'lg', label: 'Large', size: 'lg', glassParams: { strength: 1.1, edgeFalloff: 18 } },
  {
    id: 'max',
    label: 'Max Distort',
    glassParams: { strength: 1.6, edgeFalloff: 22, borderRadius: 12 },
  },
  {
    id: 'minimal',
    label: 'Minimal',
    glassParams: { strength: 0.35, edgeFalloff: 5, borderRadius: 6 },
  },
]

export interface DemoButtonGroupConfig {
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

export const DEMO_BUTTON_GROUPS: DemoButtonGroupConfig[] = [
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
    name: 'slider-transport',
    label: 'Slider · 5 options',
    category: 'slider',
    variant: 'slider',
    defaultValue: 'bus',
    size: 'sm',
    glassParams: { borderRadius: 999, strength: 1.05, edgeFalloff: 11 },
    items: [
      { value: 'walk', label: '❤️' },
      { value: 'bike', label: '🌟' },
      { value: 'bus', label: '🚌' },
      { value: 'car', label: '🚗' },
      { value: 'fly', label: '🚀' },
    ],
  },
]

export const INITIAL_GROUP_VALUES = Object.fromEntries(
  DEMO_BUTTON_GROUPS.map(({ name, defaultValue }) => [name, defaultValue]),
)
