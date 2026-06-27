import { createContext, useContext, type ReactNode } from 'react'
import type { LiquidGlassNestedPolicy } from './types'
import { DEFAULT_NESTED_POLICY } from './resolveEffectiveFilterMode'

interface LiquidGlassFilterContextValue {
  activeFilterDepth: number
  nestedPolicy: LiquidGlassNestedPolicy
  isStackLayer: boolean
}

const LiquidGlassFilterContext = createContext<LiquidGlassFilterContextValue>({
  activeFilterDepth: 0,
  nestedPolicy: DEFAULT_NESTED_POLICY,
  isStackLayer: false,
})

export function LiquidGlassFilterDepthProvider({
  depth,
  children,
}: {
  depth: number
  children: ReactNode
}) {
  const parent = useContext(LiquidGlassFilterContext)

  return (
    <LiquidGlassFilterContext.Provider
      value={{
        activeFilterDepth: depth,
        nestedPolicy: parent.nestedPolicy,
        isStackLayer: parent.isStackLayer,
      }}
    >
      {children}
    </LiquidGlassFilterContext.Provider>
  )
}

export function LiquidGlassStackLayerProvider({ children }: { children: ReactNode }) {
  const parent = useContext(LiquidGlassFilterContext)

  return (
    <LiquidGlassFilterContext.Provider
      value={{
        activeFilterDepth: 0,
        nestedPolicy: parent.nestedPolicy,
        isStackLayer: true,
      }}
    >
      {children}
    </LiquidGlassFilterContext.Provider>
  )
}

export function LiquidGlassNestedPolicyProvider({
  nestedPolicy,
  children,
}: {
  nestedPolicy: LiquidGlassNestedPolicy
  children: ReactNode
}) {
  const parent = useContext(LiquidGlassFilterContext)

  return (
    <LiquidGlassFilterContext.Provider
      value={{
        activeFilterDepth: parent.activeFilterDepth,
        nestedPolicy,
        isStackLayer: parent.isStackLayer,
      }}
    >
      {children}
    </LiquidGlassFilterContext.Provider>
  )
}

export function useLiquidGlassFilterContext(): LiquidGlassFilterContextValue {
  return useContext(LiquidGlassFilterContext)
}

export function LiquidGlassHostBoundary({
  enabled,
  children,
}: {
  enabled: boolean
  children: ReactNode
}) {
  const { activeFilterDepth } = useLiquidGlassFilterContext()

  if (!enabled) return children

  return (
    <LiquidGlassFilterDepthProvider depth={activeFilterDepth + 1}>
      {children}
    </LiquidGlassFilterDepthProvider>
  )
}
