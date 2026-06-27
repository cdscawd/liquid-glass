export interface LiquidGlassMapInput {
  /** 按钮实际宽度（px） */
  width: number
  /** 按钮实际高度（px） */
  height: number
  /** 圆角半径（px），默认 8 */
  borderRadius?: number
  /** 边缘扭曲带宽（px），默认按短边 18% 计算 */
  edgeFalloff?: number
  /** 扭曲强度 0–1，默认 1 */
  strength?: number
}

export interface LiquidGlassParams {
  borderRadius?: number
  edgeFalloff?: number
  strength?: number
}

/** 组件自身 filter 行为 */
export type LiquidGlassFilterMode = 'filter' | 'surface' | 'auto'

/** 检测到已在 filter 宿主内部时的策略（auto 模式生效） */
export type LiquidGlassNestedPolicy = 'overlay' | 'surface' | 'filter'

export interface LiquidGlassHostProps {
  glassParams?: LiquidGlassParams
  filterMode?: LiquidGlassFilterMode
  nestedPolicy?: LiquidGlassNestedPolicy
}
