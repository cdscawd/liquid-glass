import { type ReactNode } from 'react'
import { LiquidGlassButton } from '../LiquidGlassButton'
import { LiquidGlassPopover } from '../LiquidGlassPopover'
import type { LiquidGlassParams } from '../../lib/liquid-glass'
import './LiquidGlassPopconfirm.scss'

export interface LiquidGlassPopconfirmProps {
  glassParams?: LiquidGlassParams
  title?: ReactNode
  description?: ReactNode
  okText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  trigger: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function LiquidGlassPopconfirm({
  glassParams,
  title = '确认操作？',
  description,
  okText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
}: LiquidGlassPopconfirmProps) {
  return (
    <LiquidGlassPopover
      glassParams={glassParams}
      trigger={trigger}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      content={
        <div className="liquid-glass-popconfirm">
          <div className="liquid-glass-popconfirm__title">{title}</div>
          {description && (
            <div className="liquid-glass-popconfirm__desc">{description}</div>
          )}
          <div className="liquid-glass-popconfirm__actions">
            <LiquidGlassButton
              size="sm"
              onClick={() => {
                onCancel?.()
                onOpenChange?.(false)
              }}
            >
              {cancelText}
            </LiquidGlassButton>
            <LiquidGlassButton
              size="sm"
              onClick={() => {
                onConfirm?.()
                onOpenChange?.(false)
              }}
            >
              {okText}
            </LiquidGlassButton>
          </div>
        </div>
      }
    />
  )
}

export default LiquidGlassPopconfirm
