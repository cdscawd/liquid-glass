precision mediump float;

uniform highp float uTime;

in vec3 vColor;
in float vSeed;
in float vFade;
in float vSize;

out vec4 outColor;

void main() {
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);

  // 实心核 + 外圈光晕（原版为单一 smoothstep 圆点）
  float core = smoothstep(0.46, 0.0, dist);
  float halo = smoothstep(0.5, 0.18, dist) * 0.38;
  float alpha = core * core + halo;

  // 双频闪烁，节奏与原版的单频 sin 不同
  float pulse = 0.52 + 0.48 * sin(vSeed * 31.0 + uTime * 3.1);
  float shimmer = 0.82 + 0.18 * cos(vSeed * 19.0 - uTime * 1.55);
  vec3 color = vColor * (0.5 + 0.58 * pulse) * shimmer;

  outColor = vec4(color, alpha * vFade);
}
