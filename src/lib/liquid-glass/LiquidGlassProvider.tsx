import { createContext, useContext, useMemo, type ReactNode } from 'react'
import {
  LiquidGlassNestedPolicyProvider,
} from './LiquidGlassFilterContext'
import { DEFAULT_NESTED_POLICY } from './resolveEffectiveFilterMode'
import type { LiquidGlassNestedPolicy, LiquidGlassParams } from './types'
import type { LiquidGlassVariant } from './variant'

interface LiquidGlassContextValue {
  glassParams?: LiquidGlassParams
  variant?: LiquidGlassVariant
  nestedPolicy: LiquidGlassNestedPolicy
}

const LiquidGlassContext = createContext<LiquidGlassContextValue | null>(null)

export interface LiquidGlassProviderProps {
  glassParams?: LiquidGlassParams
  /** 子组件未传 variant 时的默认语义色 */
  variant?: LiquidGlassVariant
  /** 嵌套在 filter 宿主内时的默认策略 */
  nestedPolicy?: LiquidGlassNestedPolicy
  children: ReactNode
}

export function LiquidGlassProvider({
  glassParams,
  variant,
  nestedPolicy = DEFAULT_NESTED_POLICY,
  children,
}: LiquidGlassProviderProps) {
  const value = useMemo(
    () => ({ glassParams, variant, nestedPolicy }),
    [glassParams, variant, nestedPolicy],
  )

  return (
    <LiquidGlassContext.Provider value={value}>
      <LiquidGlassNestedPolicyProvider nestedPolicy={nestedPolicy}>
        {children}
      </LiquidGlassNestedPolicyProvider>
    </LiquidGlassContext.Provider>
  )
}

export function useLiquidGlassDefaults(): LiquidGlassParams | undefined {
  return useContext(LiquidGlassContext)?.glassParams
}

export function useLiquidGlassVariantDefault(): LiquidGlassVariant | undefined {
  return useContext(LiquidGlassContext)?.variant
}

export function useLiquidGlassNestedPolicyDefault(): LiquidGlassNestedPolicy {
  return useContext(LiquidGlassContext)?.nestedPolicy ?? DEFAULT_NESTED_POLICY
}
