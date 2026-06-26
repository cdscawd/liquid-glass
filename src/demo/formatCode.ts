import type { LiquidGlassParams } from '../lib/liquid-glass'

export function formatGlassParams(params?: LiquidGlassParams): string {
  if (!params || Object.keys(params).length === 0) return ''

  const parts: string[] = []
  if (params.borderRadius !== undefined) {
    parts.push(`borderRadius: ${params.borderRadius}`)
  }
  if (params.edgeFalloff !== undefined) {
    parts.push(`edgeFalloff: ${params.edgeFalloff}`)
  }
  if (params.strength !== undefined) {
    parts.push(`strength: ${params.strength}`)
  }

  return parts.length > 0 ? `{ ${parts.join(', ')} }` : ''
}

export function glassPropsLine(params?: LiquidGlassParams, indent = '  '): string {
  const formatted = formatGlassParams(params)
  return formatted ? `${indent}glassParams={${formatted}}\n` : ''
}

export function thumbPropsLine(params?: LiquidGlassParams, indent = '  '): string {
  const formatted = formatGlassParams(params)
  return formatted ? `${indent}thumbGlassParams={${formatted}}\n` : ''
}

export function fillPropsLine(params?: LiquidGlassParams, indent = '  '): string {
  const formatted = formatGlassParams(params)
  return formatted ? `${indent}fillGlassParams={${formatted}}\n` : ''
}

export function panelPropsLine(params?: LiquidGlassParams, indent = '  '): string {
  const formatted = formatGlassParams(params)
  return formatted ? `${indent}panelGlassParams={${formatted}}\n` : ''
}

export function sizePropLine(size?: string, indent = '  '): string {
  return size && size !== 'md' ? `${indent}size="${size}"\n` : ''
}

export function propLine(name: string, value: string | number | boolean, indent = '  '): string {
  if (typeof value === 'boolean') {
    return value ? `${indent}${name}\n` : `${indent}${name}={false}\n`
  }
  if (typeof value === 'number') {
    return `${indent}${name}={${value}}\n`
  }
  return `${indent}${name}="${value}"\n`
}
