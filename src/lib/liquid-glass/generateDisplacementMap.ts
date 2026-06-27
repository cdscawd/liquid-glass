import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_EDGE_FALLOFF_RATIO,
  DISPLACEMENT_SCALE,
} from './constants'
import type { LiquidGlassDeformEdge, LiquidGlassMapInput } from './types'

export { DISPLACEMENT_SCALE }

function clampByte(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)))
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/** Inigo Quilez 圆角矩形 SDF（像素坐标，中心为原点） */
function sdRoundedBox(
  x: number,
  y: number,
  halfW: number,
  halfH: number,
  radius: number,
): number {
  const qx = Math.abs(x) - halfW + radius
  const qy = Math.abs(y) - halfH + radius
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - radius
}

function sdfGradient(
  x: number,
  y: number,
  halfW: number,
  halfH: number,
  radius: number,
): { x: number; y: number } {
  const eps = 1
  const dx =
    (sdRoundedBox(x + eps, y, halfW, halfH, radius) -
      sdRoundedBox(x - eps, y, halfW, halfH, radius)) /
    (2 * eps)
  const dy =
    (sdRoundedBox(x, y + eps, halfW, halfH, radius) -
      sdRoundedBox(x, y - eps, halfW, halfH, radius)) /
    (2 * eps)
  const len = Math.hypot(dx, dy) || 1
  return { x: dx / len, y: dy / len }
}

function getDirectedMeltWeight(
  edge: LiquidGlassDeformEdge,
  pX: number,
  pY: number,
  halfW: number,
  halfH: number,
  cornerR: number,
  signedDist: number,
  extent: number,
  spread: number,
  dripExtent: number,
): number {
  const outsideDist = Math.max(0, signedDist)
  let depthFromEdge = 0
  let spreadAxis = 0
  let spreadHalf = 0
  let onTargetEdge = false

  switch (edge) {
    case 'bottom':
      depthFromEdge = halfH - pY
      spreadAxis = Math.abs(pX)
      spreadHalf = Math.max(halfW - cornerR, 1)
      onTargetEdge = pY >= halfH - cornerR
      if (depthFromEdge < 0 && onTargetEdge && outsideDist > 0 && outsideDist <= dripExtent) {
        const drip = 1 - smoothstep(0, dripExtent, outsideDist)
        const bulge = 1 - smoothstep(0, spreadHalf * spread, spreadAxis)
        return drip * bulge
      }
      if (depthFromEdge < 0) return 0
      break
    case 'top':
      depthFromEdge = halfH + pY
      spreadAxis = Math.abs(pX)
      spreadHalf = Math.max(halfW - cornerR, 1)
      onTargetEdge = pY <= -halfH + cornerR
      if (depthFromEdge < 0 && onTargetEdge && outsideDist > 0 && outsideDist <= dripExtent) {
        const drip = 1 - smoothstep(0, dripExtent, outsideDist)
        const bulge = 1 - smoothstep(0, spreadHalf * spread, spreadAxis)
        return drip * bulge
      }
      if (depthFromEdge < 0) return 0
      break
    case 'left':
      depthFromEdge = halfW + pX
      spreadAxis = Math.abs(pY)
      spreadHalf = Math.max(halfH - cornerR, 1)
      onTargetEdge = pX <= -halfW + cornerR
      if (depthFromEdge < 0 && onTargetEdge && outsideDist > 0 && outsideDist <= dripExtent) {
        const drip = 1 - smoothstep(0, dripExtent, outsideDist)
        const bulge = 1 - smoothstep(0, spreadHalf * spread, spreadAxis)
        return drip * bulge
      }
      if (depthFromEdge < 0) return 0
      break
    case 'right':
      depthFromEdge = halfW - pX
      spreadAxis = Math.abs(pY)
      spreadHalf = Math.max(halfH - cornerR, 1)
      onTargetEdge = pX >= halfW - cornerR
      if (depthFromEdge < 0 && onTargetEdge && outsideDist > 0 && outsideDist <= dripExtent) {
        const drip = 1 - smoothstep(0, dripExtent, outsideDist)
        const bulge = 1 - smoothstep(0, spreadHalf * spread, spreadAxis)
        return drip * bulge
      }
      if (depthFromEdge < 0) return 0
      break
    default:
      return 0
  }

  const zone = 1 - smoothstep(0, extent, depthFromEdge)
  const bulge = 1 - smoothstep(0, spreadHalf * spread, spreadAxis)
  return zone * bulge
}

function getDirectedMeltDisplacement(
  edge: LiquidGlassDeformEdge,
  melt: number,
  deformStrength: number,
  deformVertical: number,
  pX: number,
  pY: number,
): { x: number; y: number } {
  const main = melt * deformStrength * deformVertical
  const lateral = melt * deformStrength * 0.18

  switch (edge) {
    case 'bottom':
      // 负 Y：采样上移，视觉上背景向下「流淌」
      return { x: pX === 0 ? 0 : lateral * Math.sign(pX), y: -main }
    case 'top':
      return { x: pX === 0 ? 0 : lateral * Math.sign(pX), y: main }
    case 'left':
      return { x: main, y: pY === 0 ? 0 : lateral * Math.sign(pY) }
    case 'right':
      return { x: -main, y: pY === 0 ? 0 : lateral * Math.sign(pY) }
    default:
      return { x: 0, y: 0 }
  }
}

/**
 * 按按钮真实尺寸生成位移贴图：
 * 中心平坦、四周边缘沿法线方向扭曲；可选定向 melt（如 iOS Widget 底边流淌）
 */
export function generateDisplacementMap(input: LiquidGlassMapInput): string {
  const width = Math.max(Math.round(input.width), 2)
  const height = Math.max(Math.round(input.height), 2)
  const borderRadius = input.borderRadius ?? DEFAULT_BORDER_RADIUS
  const edgeFalloff =
    input.edgeFalloff ??
    Math.min(width, height) * DEFAULT_EDGE_FALLOFF_RATIO
  const strength = input.strength ?? 1

  const deformEdge = input.deformEdge ?? 'all'
  const hasDirectedMelt =
    deformEdge !== 'all' &&
    input.deformStrength !== undefined &&
    input.deformStrength !== 0
  const deformExtent = input.deformExtent ?? edgeFalloff
  const deformStrength = input.deformStrength ?? 0
  const deformVertical = input.deformVertical ?? 2
  const deformSpread = input.deformSpread ?? 0.75
  const deformDrip = Math.max(deformExtent * 0.45, 12)

  const halfW = width / 2 - 0.5
  const halfH = height / 2 - 0.5
  const cornerR = Math.min(borderRadius, halfW, halfH)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const imageData = ctx.createImageData(width, height)
  const data = imageData.data
  const cx = width / 2
  const cy = height / 2

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const pX = px - cx + 0.5
      const pY = py - cy + 0.5

      const signedDist = sdRoundedBox(pX, pY, halfW, halfH, cornerR)
      const insideDepth = Math.max(0, -signedDist)
      const grad = sdfGradient(pX, pY, halfW, halfH, cornerR)

      const i = (py * width + px) * 4

      let melt = 0
      if (hasDirectedMelt) {
        melt = getDirectedMeltWeight(
          deformEdge,
          pX,
          pY,
          halfW,
          halfH,
          cornerR,
          signedDist,
          deformExtent,
          deformSpread,
          deformDrip,
        )
      }

      if (insideDepth <= 0 && melt <= 0) {
        data[i] = 128
        data[i + 1] = 128
        data[i + 2] = 128
        data[i + 3] = 255
        continue
      }

      const rim =
        insideDepth > 0 ? 1 - smoothstep(0, edgeFalloff, insideDepth) : 0
      const rimAttenuation = hasDirectedMelt ? 1 - melt * 0.92 : 1
      let dispX = grad.x * rim * strength * rimAttenuation
      let dispY = grad.y * rim * strength * rimAttenuation

      if (melt > 0) {
        const directed = getDirectedMeltDisplacement(
          deformEdge,
          melt,
          deformStrength,
          deformVertical,
          pX,
          pY,
        )
        dispX += directed.x
        dispY += directed.y
      }

      data[i] = clampByte(128 + dispX * 127)
      data[i + 1] = clampByte(128 + dispY * 127)
      data[i + 2] = 128
      data[i + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/png')
}
