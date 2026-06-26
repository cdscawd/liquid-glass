export const SPACE = {
  rtWidth: 768,
  tunnelDepth: 55,
  frameHalf: 6,
  tunnelBoxDepth: 140,
  pulseInterval: 3.0,
  floaterCount: 14,
  floaterSpeed: 3.8,
  lightSpeed: 6.5,
  diveDistance: 26,
  fovPunch: 10,
  particleCount: 4000,
  particleCountLow: 2000,
  particleDepth: 60,
};

export const FLOATER = {
  movement: { sinFreq: 0.2, cosFreq: 0.24, amp: 0.45 },
  layout: {
    baseRadius: 3.2,
    radiusVariance: 2.2,
    xMultiplier: 0.95,
    scaleMin: 0.45,
    scaleVariance: 0.65,
    rotMax: 0.35,
  },
  color: {
    hueBase: 0.48,
    hueVariance: 0.28,
    saturation: 0.58,
    lightness: 0.78,
  },
  geometry: { boxSize: 0.92, polyRadius: 0.68 },
  material: {
    color: 0xffffff,
    shininess: 75,
    specular: 0x88ccdd,
    emissive: 0x3d8a9e,
    emissiveIntensity: 1.25,
    reflectivity: 0.55,
  },
  performance: { reducedRatio: 0.5 },
};

export const ENV_MAP = {
  width: 512,
  height: 256,
  bg: {
    stops: [
      { offset: 0, color: '#081828' },
      { offset: 0.45, color: '#040810' },
      { offset: 1, color: '#1a1038' },
    ],
  },
  neon: {
    yRatio: 0.42,
    radiusRatio: 0.55,
    bands: [
      { xf: 0.18, color: '#2ec4b6' },
      { xf: 0.52, color: '#e8a84a' },
      { xf: 0.82, color: '#c77dff' },
    ],
  },
};

export const LIGHTS = {
  ambient: { color: '#557799', intensity: 1.05 },
  cyan: { color: '#44c9bb', intensity: 46, distance: 58, decay: 2 },
  purple: { color: '#b86ed4', intensity: 44, distance: 58, decay: 2 },
  layout: { ratioX: 0.55, ratioY: 0.28, purpleOffsetZ: 38 },
};

export const PARTICLE = {
  layout: { baseRadius: 3.6, radiusVariance: 2.4, xMultiplier: 0.92 },
  color: {
    threshold1: 0.7,
    threshold2: 0.38,
    /** 薄荷青 — 主色调 */
    blue: [0.42, 0.88, 0.92],
    /** 琥珀金 — 暖色点缀 */
    cyan: [0.98, 0.72, 0.38],
    /** 淡紫粉 — 辅助色 */
    purple: [0.88, 0.48, 0.96],
  },
  uniforms: { speed: 8, size: 0.4, flow: 1.75 },
  performance: { reducedRatio: 0.5 },
};

export const TUNNEL = {
  layout: { zOffset: 15, spanOffset: 30 },
  color: {
    neonBlue: [0.3, 0.7, 1.4],
    neonPurple: [0.7, 0.35, 1.5],
    baseWall: [0.05, 0.11, 0.22],
    seamGlow: [0.6, 0.8, 1],
    nodeGlow: [0.9, 0.95, 1],
    pulseGlow: [0.7, 0.85, 1],
  },
  fog: { density: 0.025 },
};
