import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  GLSL3,
  Points,
  ShaderMaterial,
} from 'three';
import { PARTICLE, SPACE } from '../config/space.js';
import particleFrag from '../shaders/particle.frag.glsl?raw';
import particleVert from '../shaders/particle.vert.glsl?raw';

export class Particles {
  constructor({ rtHeight, isLowPower }) {
    this.props = { rtHeight, isLowPower };
    this.maxCount = SPACE.particleCount;
    this.isReduced = false;
    this.isLowPower = isLowPower;
    this.points = this.createPoints();
    this._objects = [this.points];
    this.applyDrawRange();
  }

  get objects() {
    return this._objects;
  }

  update(time) {
    this.points.material.uniforms.uTime.value = time;
  }

  setReduced(reduced) {
    this.isReduced = reduced;
    this.applyDrawRange();
  }

  setLowPower(lowPower) {
    this.isLowPower = lowPower;
    this.applyDrawRange();
  }

  setHeight(height) {
    this.points.material.uniforms.uHeightPx.value = height;
  }

  applyDrawRange() {
    const { reducedRatio } = PARTICLE.performance;
    const base = this.isLowPower ? SPACE.particleCountLow : SPACE.particleCount;
    const count = this.isReduced ? Math.floor(base * reducedRatio) : base;
    this.points.geometry.setDrawRange(0, count);
  }

  createPoints() {
    const points = new Points(this.createGeometry(), this.createMaterial());
    points.frustumCulled = false;
    return points;
  }

  createGeometry() {
    const positions = new Float32Array(this.maxCount * 3);
    const seeds = new Float32Array(this.maxCount);
    const colors = new Float32Array(this.maxCount * 3);
    const { layout, color } = PARTICLE;

    for (let i = 0; i < this.maxCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = layout.baseRadius + Math.random() * layout.radiusVariance;
      const x = Math.cos(angle) * radius * layout.xMultiplier;
      const y = Math.sin(angle) * radius;
      const offset = i * 3;

      positions[offset] = x;
      positions[offset + 1] = y;
      positions[offset + 2] = -Math.random() * SPACE.particleDepth;
      seeds[i] = Math.random();

      const pick = Math.random();
      let rgb;
      if (pick > color.threshold1) rgb = color.purple;
      else if (pick > color.threshold2) rgb = color.cyan;
      else rgb = color.blue;

      colors[offset] = rgb[0];
      colors[offset + 1] = rgb[1];
      colors[offset + 2] = rgb[2];
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));
    geometry.setAttribute('aColor', new BufferAttribute(colors, 3));
    return geometry;
  }

  createMaterial() {
    const { particleDepth } = SPACE;
    const { uniforms } = PARTICLE;

    return new ShaderMaterial({
      uniforms: {
        uDepth: { value: particleDepth },
        uFlow: { value: uniforms.flow },
        uHeightPx: { value: this.props.rtHeight },
        uSize: { value: uniforms.size },
        uSpeed: { value: uniforms.speed },
        uTime: { value: 0 },
      },
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: AdditiveBlending,
      glslVersion: GLSL3,
    });
  }
}
