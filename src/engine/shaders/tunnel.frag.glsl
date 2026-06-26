precision mediump float;

uniform vec3 uColorBlue;
uniform vec3 uColorPurple;
uniform vec3 uColorBaseWall;
uniform vec3 uColorSeamGlow;
uniform vec3 uColorNodeGlow;
uniform vec3 uColorPulseGlow;
uniform float uHalf;
uniform float uFogDensity;

uniform highp float uInterval;
uniform highp float uSpan;
uniform highp float uTime;

in highp float vDist;
in highp float vZ;
in highp vec3 vWorld;

out vec4 outColor;

void main() {
  float across = clamp(min(abs(vWorld.x), abs(vWorld.y)) / uHalf, 0.0, 1.0);
  float edgeGlow = across * across * across;

  // 原版蓝紫渐变：沿 Z 轴 sin 混合 neonBlue ↔ neonPurple
  float mixv = 0.5 + 0.5 * sin(vZ * 0.15 + uTime * 0.5);
  vec3 neonColor = mix(uColorBlue, uColorPurple, mixv);

  vec3 color = uColorBaseWall;
  float cornerLine = smoothstep(0.9, 1.0, across);
  color += neonColor * edgeGlow * 1.0;
  color += neonColor * cornerLine * 0.9;

  // 方块分段缝（保留当前结构，使用原版线条配色强度）
  float blockFlow = fract(vZ * 0.19 - uTime * 0.32);
  float blockSeam = smoothstep(0.0, 0.06, blockFlow) * smoothstep(0.18, 0.1, blockFlow);
  color += neonColor * blockSeam * 0.6;
  color += uColorSeamGlow * blockSeam * 0.35;

  // 纵向网格线
  float gridX = abs(fract(abs(vWorld.x) * 0.55 - uTime * 0.055) - 0.5);
  float gridY = abs(fract(abs(vWorld.y) * 0.55 - uTime * 0.055) - 0.5);
  float gridLine = smoothstep(0.47, 0.5, min(gridX, gridY));
  color += neonColor * gridLine * edgeGlow * 0.6;
  color += uColorSeamGlow * gridLine * 0.25;

  float angle = atan(vWorld.y, vWorld.x);
  float node = pow(0.5 + 0.5 * cos(angle - uTime * 1.5 + vZ * 0.6), 16.0);
  color += uColorNodeGlow * blockSeam * node * 2.0;

  // 能量脉冲波：单向向内推进
  float phase = fract(uTime / uInterval);
  float pulseZ = -phase * uSpan;
  float dz = vZ - pulseZ;
  float pulse = exp(-dz * dz * 0.01);
  color += neonColor * pulse * (0.4 + edgeGlow * 1.0);
  color += uColorPulseGlow * cornerLine * pulse * 0.6;

  float fog = exp(-vDist * uFogDensity);
  color *= fog;

  outColor = vec4(color, 1.0);
}
