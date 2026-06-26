precision mediump float;

uniform float uDepth;
uniform float uFlow;
uniform float uHeightPx;
uniform float uSize;
uniform float uSpeed;

uniform highp float uTime;

in vec3 aColor;
in float aSeed;
in float aSize;

out vec3 vColor;
out float vSeed;
out float vFade;
out float vSize;

void main() {
  highp vec3 pos = position;
  pos.z = mod(pos.z - uTime * uSpeed, uDepth) - uDepth;

  float time = uTime * 0.42;
  float bx = pos.x;
  float by = pos.y;
  float angle = atan(by, bx);

  // 螺旋飘移 + 轻微横向摆动（区别于原版的网格 sin/cos 扰动）
  pos.x += sin(angle * 3.0 + pos.z * 0.11 + time) * uFlow * 0.72;
  pos.y += cos(angle * 3.0 + pos.z * 0.11 + time * 1.08) * uFlow * 0.72;
  pos.x += cos(by * 0.38 + time * 1.25) * uFlow * 0.32;
  pos.y += sin(bx * 0.38 + time * 0.88) * uFlow * 0.32;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float dist = -mv.z;
  vSeed = aSeed;
  vColor = aColor;
  vSize = aSize;

  float nearFade = smoothstep(0.8, 4.5, dist);
  float farFade = 1.0 - smoothstep(uDepth * 0.65, uDepth, dist);
  vFade = nearFade * farFade;

  gl_PointSize = clamp(uSize * aSize * (uHeightPx * 0.52) / max(dist, 0.1), 0.0, 20.0);
}
