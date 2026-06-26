import {
  BoxGeometry,
  Color,
  InstancedMesh,
  MeshPhongMaterial,
  Object3D,
  OctahedronGeometry,
  TetrahedronGeometry,
} from 'three';
import { FLOATER, SPACE } from '../config/space.js';
import { createEnvMapTexture } from './SpaceLights.js';
import { wrapZ } from '../utils/dom.js';

export class Floaters {
  constructor() {
    this.floaters = [];
    this.meshes = [];
    this.dummy = new Object3D();
    this.fullCounts = [];
    this.createObjects();
    this._objects = this.meshes;
  }

  get objects() {
    return this._objects;
  }

  update(time) {
    const { floaterSpeed } = SPACE;
    const { movement } = FLOATER;

    for (let i = 0; i < this.floaters.length; i += 1) {
      const floater = this.floaters[i];
      if (floater.localIndex >= this.meshes[floater.geoIndex].count) continue;

      this.dummy.position.set(
        floater.baseX + Math.sin(time * movement.sinFreq + floater.phase) * movement.amp,
        floater.baseY + Math.cos(time * movement.cosFreq + floater.phase) * movement.amp,
        wrapZ(floater.baseZ - time * floaterSpeed),
      );
      this.dummy.rotation.set(time * floater.rotX, time * floater.rotY, time * floater.rotZ);
      this.dummy.scale.setScalar(floater.scale);
      this.dummy.updateMatrix();
      this.meshes[floater.geoIndex].setMatrixAt(floater.localIndex, this.dummy.matrix);
    }

    for (let i = 0; i < this.meshes.length; i += 1) {
      this.meshes[i].instanceMatrix.needsUpdate = true;
    }
  }

  setReduced(reduced) {
    for (let i = 0; i < this.meshes.length; i += 1) {
      const full = this.fullCounts[i];
      this.meshes[i].count = reduced
        ? Math.ceil(full * FLOATER.performance.reducedRatio)
        : full;
    }
  }

  createObjects() {
    const geometries = this.createGeometries();
    const material = this.createMaterial();
    const { layout, color } = FLOATER;
    const counts = new Array(geometries.length).fill(0);

    for (let i = 0; i < SPACE.floaterCount; i += 1) {
      const geoIndex = i % geometries.length;
      const angle = Math.random() * Math.PI * 2;
      const radius = layout.baseRadius + Math.random() * layout.radiusVariance;

      this.floaters.push({
        geoIndex,
        localIndex: counts[geoIndex],
        baseX: Math.cos(angle) * radius * layout.xMultiplier,
        baseY: Math.sin(angle) * radius,
        baseZ: Math.random() * SPACE.tunnelDepth,
        phase: Math.random() * Math.PI * 2,
        scale: layout.scaleMin + Math.random() * layout.scaleVariance,
        rotX: (Math.random() * 2 - 1) * layout.rotMax,
        rotY: (Math.random() * 2 - 1) * layout.rotMax,
        rotZ: (Math.random() * 2 - 1) * layout.rotMax,
      });

      counts[geoIndex] += 1;
    }

    this.fullCounts = counts;

    for (let i = 0; i < geometries.length; i += 1) {
      const mesh = new InstancedMesh(geometries[i], material, counts[i]);
      mesh.frustumCulled = false;
      this.meshes.push(mesh);
    }

    const instanceColor = new Color();
    for (let i = 0; i < this.floaters.length; i += 1) {
      const floater = this.floaters[i];
      instanceColor.setHSL(
        color.hueBase + Math.random() * color.hueVariance,
        color.saturation,
        color.lightness,
      );
      this.meshes[floater.geoIndex].setColorAt(floater.localIndex, instanceColor);
    }

    for (let i = 0; i < this.meshes.length; i += 1) {
      if (this.meshes[i].instanceColor) {
        this.meshes[i].instanceColor.needsUpdate = true;
      }
    }
  }

  createGeometries() {
    const { geometry } = FLOATER;
    return [
      new BoxGeometry(geometry.boxSize, geometry.boxSize, geometry.boxSize),
      new OctahedronGeometry(geometry.polyRadius),
      new TetrahedronGeometry(geometry.polyRadius),
    ];
  }

  createMaterial() {
    const { material } = FLOATER;
    return new MeshPhongMaterial({
      color: new Color(material.color),
      shininess: material.shininess,
      specular: new Color(material.specular),
      emissive: new Color(material.emissive),
      emissiveIntensity: material.emissiveIntensity,
      reflectivity: material.reflectivity,
      envMap: createEnvMapTexture(),
      fog: true,
    });
  }
}
