import type { LiquidGlassParams } from '../lib/liquid-glass'

export const DEFAULT_GLOBAL_GLASS: LiquidGlassParams = {
  borderRadius: 8,
  strength: 1,
  edgeFalloff: 14,
}

export interface GlobalGlassPreset {
  id: string
  label: string
  params: LiquidGlassParams
}

export const GLOBAL_GLASS_PRESETS: GlobalGlassPreset[] = [
  { id: 'default', label: 'Default', params: DEFAULT_GLOBAL_GLASS },
  {
    id: 'strong',
    label: 'Strong',
    params: { borderRadius: 12, strength: 1.35, edgeFalloff: 20 },
  },
  {
    id: 'pill',
    label: 'Pill',
    params: { borderRadius: 999, strength: 0.85, edgeFalloff: 16 },
  },
]
