import type { LiquidGlassParams } from './types'

/** feDisplacementMap scale，取自 21st.dev Liquid Glass 演示 */
export const DISPLACEMENT_SCALE = 59.66173422287144

/** 固定 backdrop 链，所有 Liquid Glass 组件共用 */
export const BACKDROP_FILTER =
  'blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1)'

export const DEFAULT_BORDER_RADIUS = 8

/** 边缘扭曲带默认占短边比例 */
export const DEFAULT_EDGE_FALLOFF_RATIO = 0.18

/** 形状预设（与 _variables.scss 对齐） */
export const PILL_BORDER_RADIUS = 999

/** borderRadius 达到 pill 预设，或已覆盖短边一半时视为胶囊形 */
export function isPillBorderRadius(borderRadius: number, shortSide?: number): boolean {
  if (borderRadius >= PILL_BORDER_RADIUS) return true
  if (shortSide != null && shortSide > 0 && borderRadius >= shortSide / 2) return true
  return false
}
export const DOCK_BORDER_RADIUS = 24
export const BADGE_BORDER_RADIUS = 6

export const GLASS_SHAPE = {
  default: DEFAULT_BORDER_RADIUS,
  pill: PILL_BORDER_RADIUS,
  dock: DOCK_BORDER_RADIUS,
  badge: BADGE_BORDER_RADIUS,
} as const

export type GlassShapePreset = keyof typeof GLASS_SHAPE

/** 默认折射参数 */
export const DEFAULT_GLASS_PARAMS: LiquidGlassParams = {
  borderRadius: DEFAULT_BORDER_RADIUS,
  strength: 1,
}

/** 滑动 thumb / 指示器默认强度 */
export const DEFAULT_THUMB_STRENGTH = 1.15

/** Progress fill 相对 track 的强度倍率 */
export const DEFAULT_FILL_STRENGTH_MULTIPLIER = 1.1
