import {
  AmbientLight,
  CanvasTexture,
  Color,
  EquirectangularReflectionMapping,
  PointLight,
  SRGBColorSpace,
} from 'three';
import { ENV_MAP, LIGHTS, SPACE } from '../config/space.js';
import { wrapZ } from '../utils/dom.js';

export function createEnvMapTexture() {
  const { width, height, bg, neon } = ENV_MAP;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  bg.stops.forEach(({ offset, color }) => gradient.addColorStop(offset, color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = 'lighter';
  const y = height * neon.yRatio;
  const radius = height * neon.radiusRatio;

  neon.bands.forEach(({ xf, color }) => {
    const x = xf * width;
    const radial = ctx.createRadialGradient(x, y, 0, x, y, radius);
    radial.addColorStop(0, color);
    radial.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
  });

  const texture = new CanvasTexture(canvas);
  texture.mapping = EquirectangularReflectionMapping;
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export class SpaceLights {
  constructor() {
    const ambient = this.createAmbientLight();
    this.cyanLight = this.createPointLight(
      LIGHTS.cyan.color,
      LIGHTS.cyan.intensity,
      LIGHTS.cyan.distance,
      LIGHTS.cyan.decay,
    );
    this.purpleLight = this.createPointLight(
      LIGHTS.purple.color,
      LIGHTS.purple.intensity,
      LIGHTS.purple.distance,
      LIGHTS.purple.decay,
    );
    this._objects = [ambient, this.cyanLight, this.purpleLight];
  }

  get objects() {
    return this._objects;
  }

  update(time) {
    const { frameHalf, lightSpeed } = SPACE;
    const x = frameHalf * LIGHTS.layout.ratioX;
    const y = frameHalf * LIGHTS.layout.ratioY;
    const z = -time * lightSpeed;

    this.cyanLight.position.set(x, y, wrapZ(z));
    this.purpleLight.position.set(-x, -y, wrapZ(LIGHTS.layout.purpleOffsetZ + z));
  }

  createAmbientLight() {
    return new AmbientLight(LIGHTS.ambient.color, LIGHTS.ambient.intensity);
  }

  createPointLight(color, intensity, distance, decay) {
    return new PointLight(color, intensity, distance, decay);
  }
}
