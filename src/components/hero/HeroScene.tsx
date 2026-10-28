"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Tempo the whole scene breathes to. Hard techno territory. */
export const BPM = 145;

/** Kick envelope: 1 on the beat, decaying to 0 before the next one. */
const kick = (t: number) => Math.pow(1 - ((t * BPM) / 60) % 1, 3);

const MAGENTA = new THREE.Color("#ff2bd6");
const CYAN = new THREE.Color("#00f0ff");
const LIME = new THREE.Color("#b4ff39");

/* ---------------------------------- Floor ---------------------------------- */

const floorVert = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const floorFrag = /* glsl */ `
  uniform float uTime;
  uniform float uKick;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  varying float vDepth;

  float gridLine(float coord, float width) {
    float d = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    return 1.0 - min(d / width, 1.0);
  }

  void main() {
    vec2 uv = vUv * vec2(40.0, 60.0);
    uv.y += uTime * 2.4;                       // grid rushes toward the camera
    float g = max(gridLine(uv.x, 1.2), gridLine(uv.y, 1.2));
    float fade = smoothstep(60.0, 4.0, vDepth); // dissolve into the dark
    float center = 1.0 - smoothstep(0.0, 0.5, abs(vUv.x - 0.5));
    vec3 col = mix(uColorA, uColorB, vUv.x);
    float intensity = g * fade * (0.35 + 0.9 * uKick) * (0.35 + 0.65 * center);
    gl_FragColor = vec4(col * intensity, intensity);
  }
`;

function LaserFloor() {
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uKick: { value: 0 }, uColorA: { value: MAGENTA }, uColorB: { value: CYAN } }),
    [],
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    uniforms.uTime.value = t;
    uniforms.uKick.value = kick(t);
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -2.2, -20]}>
      <planeGeometry args={[80, 80, 1, 1]} />
      <shaderMaterial
        vertexShader={floorVert}
        fragmentShader={floorFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ----------------------------------- Core ---------------------------------- */

const coreVert = /* glsl */ `
  uniform float uTime;
  uniform float uKick;
  varying float vNoise;

  // Ashima 3D simplex noise
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    float n = snoise(position * 0.9 + vec3(0.0, uTime * 0.35, uTime * 0.2));
    vNoise = n;
    vec3 displaced = position + normal * (n * 0.28 + uKick * 0.18);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const coreFrag = /* glsl */ `
  uniform float uKick;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vNoise;
  void main() {
    vec3 col = mix(uColorA, uColorB, smoothstep(-0.6, 0.6, vNoise));
    gl_FragColor = vec4(col * (0.3 + uKick * 0.55), 0.7);
  }
`;

function Core() {
  const mesh = useRef<THREE.Mesh>(null);
  // Narrow screens have a much smaller horizontal FOV — shrink the core so it frames the title instead of swallowing it.
  const aspect = useThree((s) => s.size.width / s.size.height);
  const scale = THREE.MathUtils.clamp(aspect * 0.75, 0.5, 1);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uKick: { value: 0 }, uColorA: { value: CYAN }, uColorB: { value: MAGENTA } }),
    [],
  );
  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    uniforms.uTime.value = t;
    uniforms.uKick.value = kick(t);
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.15;
      mesh.current.rotation.x += delta * 0.05;
    }
  });
  return (
    <mesh ref={mesh} position={[0, 0.4, -6]} scale={scale}>
      <icosahedronGeometry args={[1.6, 18]} />
      <shaderMaterial
        vertexShader={coreVert}
        fragmentShader={coreFrag}
        uniforms={uniforms}
        wireframe
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ---------------------------------- Lasers --------------------------------- */

const BEAMS = 14;

function Lasers() {
  const group = useRef<THREE.Group>(null);
  const beams = useMemo(
    () =>
      Array.from({ length: BEAMS }, (_, i) => ({
        color: [MAGENTA, CYAN, LIME][i % 3],
        phase: (i / BEAMS) * Math.PI * 2,
        speed: 0.25 + (i % 4) * 0.08,
        spread: 0.5 + (i % 5) * 0.12,
      })),
    [],
  );
  // Pivot each beam from its top so it sweeps like a moving head.
  const geometry = useMemo(() => new THREE.BoxGeometry(0.025, 30, 0.025).translate(0, -15, 0), []);
  const materials = useRef<THREE.MeshBasicMaterial[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const k = kick(t);
    const bar = Math.floor((t * BPM) / 60 / 4); // flip sweep pattern every bar
    group.current?.children.forEach((child, i) => {
      const b = beams[i];
      const dir = bar % 2 === 0 ? 1 : -1;
      child.rotation.z = Math.sin(t * b.speed * dir + b.phase) * b.spread;
      child.rotation.x = -0.25 + Math.cos(t * 0.3 + b.phase) * 0.15;
      const m = materials.current[i];
      if (m) m.opacity = 0.08 + k * 0.5 * ((i + bar) % 3 === 0 ? 1 : 0.35);
    });
  });

  return (
    <group ref={group} position={[0, 4.5, -14]}>
      {beams.map((b, i) => (
        <mesh key={i} geometry={geometry}>
          <meshBasicMaterial
            ref={(m) => {
              if (m) materials.current[i] = m;
            }}
            color={b.color}
            transparent
            opacity={0.2}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* --------------------------------- Particles ------------------------------- */

const PARTICLES = 1400;

function Particles() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLES * 3);
    for (let i = 0; i < PARTICLES; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = -Math.random() * 40;
    }
    return arr;
  }, []);

  useFrame(({ clock }, delta) => {
    const attr = points.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!attr) return;
    const speed = 4 + kick(clock.elapsedTime) * 10;
    const a = attr.array as Float32Array;
    for (let i = 2; i < a.length; i += 3) {
      a[i] += delta * speed;
      if (a[i] > 4) a[i] = -40;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#ffffff" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ------------------------------ Camera parallax ---------------------------- */

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.02, delta); // frame-rate independent lerp
    camera.position.x += (pointer.x * 0.8 - camera.position.x) * k;
    camera.position.y += (0.3 + pointer.y * 0.4 - camera.position.y) * k;
    camera.lookAt(0, 0, -8);
  });
  return null;
}

/* ----------------------------------- Scene --------------------------------- */

export default function HeroScene({ active, onReady }: { active: boolean; onReady?: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.3, 4], fov: 60, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#05050a");
        scene.fog = new THREE.Fog("#05050a", 10, 40);
        onReady?.();
      }}
      // Pointer events come from the whole window so the overlay content doesn't block parallax.
      eventSource={document.body}
      eventPrefix="client"
    >
      <CameraRig />
      <LaserFloor />
      <Lasers />
      <Core />
      <Particles />
    </Canvas>
  );
}
