import { DEFAULT_GLASS_PARAMS } from './constants'
import type { LiquidGlassParams } from './types'

function pickDeformParam<K extends keyof LiquidGlassParams>(
  key: K,
  props?: LiquidGlassParams,
  context?: LiquidGlassParams,
  preset?: Partial<LiquidGlassParams>,
): LiquidGlassParams[K] | undefined {
  return props?.[key] ?? preset?.[key] ?? context?.[key]
}

export function resolveGlassParams(
  props?: LiquidGlassParams,
  context?: LiquidGlassParams,
  preset?: Partial<LiquidGlassParams>,
): LiquidGlassParams {
  return {
    borderRadius:
      props?.borderRadius ??
      preset?.borderRadius ??
      context?.borderRadius ??
      DEFAULT_GLASS_PARAMS.borderRadius,
    edgeFalloff:
      props?.edgeFalloff ?? preset?.edgeFalloff ?? context?.edgeFalloff,
    strength:
      props?.strength ??
      preset?.strength ??
      context?.strength ??
      DEFAULT_GLASS_PARAMS.strength,
    deformEdge: pickDeformParam('deformEdge', props, context, preset),
    deformExtent: pickDeformParam('deformExtent', props, context, preset),
    deformStrength: pickDeformParam('deformStrength', props, context, preset),
    deformVertical: pickDeformParam('deformVertical', props, context, preset),
    deformSpread: pickDeformParam('deformSpread', props, context, preset),
  }
}

export function glassParamsMapKey(
  width: number,
  height: number,
  params: LiquidGlassParams,
): string {
  const {
    borderRadius,
    edgeFalloff,
    strength,
    deformEdge,
    deformExtent,
    deformStrength,
    deformVertical,
    deformSpread,
  } = params

  return [
    `${width}x${height}`,
    borderRadius ?? '',
    edgeFalloff ?? '',
    strength ?? '',
    deformEdge ?? '',
    deformExtent ?? '',
    deformStrength ?? '',
    deformVertical ?? '',
    deformSpread ?? '',
  ].join(':')
}
