import { type HTMLAttributes, type ReactNode } from 'react'
import { LiquidGlassStackLayerProvider } from './LiquidGlassFilterContext'
import './LiquidGlassStack.scss'

export interface LiquidGlassStackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export interface LiquidGlassStackLayerProps extends HTMLAttributes<HTMLDivElement> {
  overlay?: boolean
  children: ReactNode
}

function LiquidGlassStackLayer({
  overlay = false,
  className = '',
  children,
  ...props
}: LiquidGlassStackLayerProps) {
  const overlayClass = overlay ? ' liquid-glass-stack__layer--overlay' : ''

  return (
    <LiquidGlassStackLayerProvider>
      <div
        className={`liquid-glass-stack__layer${overlayClass}${className ? ` ${className}` : ''}`}
        {...props}
      >
        {children}
      </div>
    </LiquidGlassStackLayerProvider>
  )
}

export function LiquidGlassStack({
  className = '',
  children,
  ...props
}: LiquidGlassStackProps) {
  return (
    <div
      className={`liquid-glass-stack${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </div>
  )
}

LiquidGlassStack.Layer = LiquidGlassStackLayer

export default LiquidGlassStack
