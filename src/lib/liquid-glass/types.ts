export interface LiquidGlassMapInput {
  /** 按钮实际宽度（px） */
  width: number
  /** 按钮实际高度（px） */
  height: number
  /** 圆角半径（px），默认 8 */
  borderRadius?: number
  /** 边缘扭曲带宽（px），默认按短边 18% 计算 */
  edgeFalloff?: number
  /** 扭曲强度，默认 1；负值反转折射方向 */
  strength?: number
  /** 定向 melt 作用边，默认 uniform 四边折射 */
  deformEdge?: LiquidGlassDeformEdge
  /** 从 deformEdge 指定边向内的影响深度（px） */
  deformExtent?: number
  /** 定向 melt 位移强度 */
  deformStrength?: number
  /** 定向 melt 垂直/主方向倍率，>1 更「拉丝」 */
  deformVertical?: number
  /** 0–1，边沿中间 bulge 宽度占 halfW/halfH 比例 */
  deformSpread?: number
}

/** iOS Widget 式定向形变边 */
export type LiquidGlassDeformEdge = 'all' | 'bottom' | 'top' | 'left' | 'right'

export interface LiquidGlassParams {
  borderRadius?: number
  edgeFalloff?: number
  strength?: number
  deformEdge?: LiquidGlassDeformEdge
  deformExtent?: number
  deformStrength?: number
  deformVertical?: number
  deformSpread?: number
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
