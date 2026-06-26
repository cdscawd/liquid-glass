import {
  Color,
  FogExp2,
  LinearFilter,
  PerspectiveCamera,
  Scene,
  WebGLRenderTarget,
} from 'three';
import { SPACE } from '../config/space.js';
import { Floaters } from './Floaters.js';
import { Particles } from './Particles.js';
import { SpaceLights } from './SpaceLights.js';
import { Tunnel } from './Tunnel.js';

export class SpaceManager {
  constructor({ aspect, isLowPower = false, particlesEnabled = true }) {
    this.lastDive = -1;
    this.prevMousePosition = { x: 0, y: 0 };
    this.mousePosition = { x: 0, y: 0 };

    const height = Math.round(SPACE.rtWidth / aspect);
    this.defaultHeight = height;

    this._scene = new Scene();
    this._scene.background = new Color(0x000000);
    this._scene.fog = new FogExp2(0x000000, 0.028);

    this._camera = new PerspectiveCamera(60, aspect, 0.1, 200);
    this._camera.position.set(0, 0, 0);
    this.baseFov = this._camera.fov;

    this._renderTarget = new WebGLRenderTarget(SPACE.rtWidth, height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      depthBuffer: true,
    });

    this.particles = particlesEnabled
      ? new Particles({ rtHeight: height, isLowPower })
      : null;

    this.layers = [
      new SpaceLights(),
      new Tunnel(),
      new Floaters(),
      ...(this.particles ? [this.particles] : []),
    ];

    this.layers.forEach((layer) => this._scene.add(...layer.objects));
  }

  get texture() {
    return this._renderTarget.texture;
  }

  get scene() {
    return this._scene;
  }

  get camera() {
    return this._camera;
  }

  get renderTarget() {
    return this._renderTarget;
  }

  setAspect(aspect) {
    if (this._camera.aspect !== aspect) {
      this._camera.aspect = aspect;
      this._camera.updateProjectionMatrix();
    }
  }

  setDive(progress) {
    if (progress === this.lastDive) return;
    this.lastDive = progress;
    this._camera.position.z = -progress * SPACE.diveDistance;
    this._camera.fov = this.baseFov + progress * SPACE.fovPunch;
    this._camera.updateProjectionMatrix();
  }

  setParallax(x, y) {
    this.prevMousePosition.x = x * 0.1;
    this.prevMousePosition.y = y * 0.1;
  }

  setReduced(reduced) {
    this.layers.forEach((layer) => layer.setReduced?.(reduced));
  }

  setLowPower(lowPower) {
    this.particles?.setLowPower(lowPower);
  }

  resize(width, height) {
    this._renderTarget.setSize(width, height);
    this.particles?.setHeight(height);
  }

  update(time) {
    this.layers.forEach((layer) => layer.update(time));

    this.mousePosition.x += (this.prevMousePosition.x - this.mousePosition.x) * 0.1;
    this.mousePosition.y += (this.prevMousePosition.y - this.mousePosition.y) * 0.1;
    this._camera.rotation.set(this.mousePosition.y, -this.mousePosition.x, 0);
  }

  resetResolution() {
    this.resize(SPACE.rtWidth, this.defaultHeight);
  }
}
