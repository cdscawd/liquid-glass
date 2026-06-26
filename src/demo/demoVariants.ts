import type { LiquidGlassParams } from '../lib/liquid-glass'

export const SIZES = ['sm', 'md', 'lg'] as const
export type DemoSize = (typeof SIZES)[number]

export interface GlassPreset {
  id: string
  label: string
  description?: string
  params: LiquidGlassParams
}

/** 通用 glassParams 预设 — 多数组件可复用 */
export const GLASS_PRESETS: GlassPreset[] = [
  { id: 'default', label: 'Default', description: '继承 Provider 或 DEFAULT_GLASS_PARAMS', params: {} },
  { id: 'subtle', label: 'Subtle', description: '低 strength · 窄 edgeFalloff', params: { strength: 0.45, edgeFalloff: 7 } },
  { id: 'strong', label: 'Strong Lens', description: '高 strength · 宽 edgeFalloff', params: { strength: 1.45, edgeFalloff: 20 } },
  { id: 'pill', label: 'Pill', description: 'borderRadius: 999', params: { borderRadius: 999, strength: 1, edgeFalloff: 14 } },
  { id: 'sharp', label: 'Sharp', description: 'borderRadius: 4', params: { borderRadius: 4, strength: 1.15, edgeFalloff: 10 } },
  { id: 'wide', label: 'Wide Edge', description: 'edgeFalloff: 24', params: { strength: 1, edgeFalloff: 24 } },
]

export const THUMB_PRESETS: GlassPreset[] = [
  { id: 'default', label: 'Default Thumb', params: {} },
  { id: 'strong', label: 'Strong Thumb', params: { strength: 1.35 } },
  { id: 'subtle', label: 'Subtle Thumb', params: { strength: 0.7 } },
]

export const FILL_PRESETS: GlassPreset[] = [
  { id: 'default', label: 'Default Fill', params: {} },
  { id: 'strong', label: 'Strong Fill', params: { strength: 1.4, edgeFalloff: 18 } },
  { id: 'pill', label: 'Pill Fill', params: { borderRadius: 999, strength: 1.1 } },
]

export const PANEL_PRESETS: GlassPreset[] = [
  { id: 'default', label: 'Default Panel', params: {} },
  { id: 'soft', label: 'Soft Panel', params: { borderRadius: 16, strength: 0.75, edgeFalloff: 12 } },
  { id: 'sharp', label: 'Sharp Panel', params: { borderRadius: 6, strength: 1.2, edgeFalloff: 8 } },
]
