import type { LiquidGlassFilterMode, LiquidGlassNestedPolicy } from './types'

export const DEFAULT_NESTED_POLICY: LiquidGlassNestedPolicy = 'overlay'

const NESTED_WITHOUT_STACK_MSG =
  '[liquid-glass] Nested glass host detected without LiquidGlassStack. ' +
  'Use <LiquidGlassStack> with sibling layers for double refraction, ' +
  'or set filterMode="filter" / nestedPolicy="filter" explicitly.'

let nestedWithoutStackWarned = false

export function resolveEffectiveFilterMode(
  filterMode: LiquidGlassFilterMode | undefined,
  nestedPolicy: LiquidGlassNestedPolicy,
  activeFilterDepth: number,
  isStackLayer: boolean,
): 'filter' | 'surface' {
  const mode = filterMode ?? 'auto'

  if (mode === 'filter') return 'filter'
  if (mode === 'surface') return 'surface'

  if (activeFilterDepth === 0) return 'filter'

  if (nestedPolicy === 'filter') return 'filter'
  if (nestedPolicy === 'surface') return 'surface'

  if (isStackLayer) return 'filter'

  if (import.meta.env.DEV && !nestedWithoutStackWarned) {
    nestedWithoutStackWarned = true
    console.warn(NESTED_WITHOUT_STACK_MSG)
  }

  return 'surface'
}
