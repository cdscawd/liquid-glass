import {
  BackSide,
  BoxGeometry,
  Color,
  GLSL3,
  Mesh,
  ShaderMaterial,
} from 'three';
import { SPACE, TUNNEL } from '../config/space.js';
import tunnelFrag from '../shaders/tunnel.frag.glsl?raw';
import tunnelVert from '../shaders/tunnel.vert.glsl?raw';

export class Tunnel {
  constructor() {
    this.mesh = this.createMesh();
    this._objects = [this.mesh];
  }

  get objects() {
    return this._objects;
  }

  update(time) {
    this.mesh.material.uniforms.uTime.value = time;
  }

  createMesh() {
    const geometry = this.createGeometry();
    const material = this.createMaterial();
    const { zOffset } = TUNNEL.layout;
    const mesh = new Mesh(geometry, material);
    mesh.position.z = -SPACE.tunnelBoxDepth / 2 + zOffset;
    mesh.frustumCulled = false;
    return mesh;
  }

  createGeometry() {
    const { frameHalf, tunnelBoxDepth } = SPACE;
    return new BoxGeometry(frameHalf * 2, frameHalf * 2, tunnelBoxDepth);
  }

  createMaterial() {
    const { frameHalf, tunnelBoxDepth, pulseInterval } = SPACE;
    const { color, fog, layout } = TUNNEL;

    return new ShaderMaterial({
      uniforms: {
        uColorBlue: { value: new Color(...color.neonBlue) },
        uColorPurple: { value: new Color(...color.neonPurple) },
        uColorBaseWall: { value: new Color(...color.baseWall) },
        uColorSeamGlow: { value: new Color(...color.seamGlow) },
        uColorNodeGlow: { value: new Color(...color.nodeGlow) },
        uColorPulseGlow: { value: new Color(...color.pulseGlow) },
        uFogDensity: { value: fog.density },
        uHalf: { value: frameHalf },
        uInterval: { value: pulseInterval },
        uSpan: { value: tunnelBoxDepth + layout.spanOffset },
        uTime: { value: 0 },
      },
      vertexShader: tunnelVert,
      fragmentShader: tunnelFrag,
      side: BackSide,
      glslVersion: GLSL3,
    });
  }
}
