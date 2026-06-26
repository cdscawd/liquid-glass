import { type ReactNode } from 'react'
import { LiquidGlassMenu, type LiquidGlassMenuItem } from '../LiquidGlassMenu'
import { LiquidGlassPopover } from '../LiquidGlassPopover'
import type { LiquidGlassParams } from '../../lib/liquid-glass'

export interface LiquidGlassDropdownProps {
  glassParams?: LiquidGlassParams
  menuGlassParams?: LiquidGlassParams
  trigger: ReactNode
  items: LiquidGlassMenuItem[]
  selectedKeys?: string[]
  onSelect?: (key: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function LiquidGlassDropdown({
  glassParams,
  menuGlassParams,
  trigger,
  items,
  selectedKeys,
  onSelect,
  open,
  defaultOpen,
  onOpenChange,
}: LiquidGlassDropdownProps) {
  return (
    <LiquidGlassPopover
      glassParams={glassParams}
      trigger={trigger}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      content={
        <LiquidGlassMenu
          glassParams={menuGlassParams}
          items={items}
          selectedKeys={selectedKeys}
          onSelect={(key) => {
            onSelect?.(key)
            onOpenChange?.(false)
          }}
        />
      }
    />
  )
}

export default LiquidGlassDropdown
