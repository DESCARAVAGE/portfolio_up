import * as THREE from "three";
import { FOG_INTERACTION } from "@/app/lib/vanta/fogConfig";

/**
 * Patch du shader Vanta FOG (vanta 0.5.x) pour ajouter :
 * - un remous autour du pointeur + un léger parallaxe global,
 * - des ondes de choc (clic / tap) qui repoussent les nuages vers l'extérieur.
 *
 * Principe : avant d'échantillonner le bruit, on décale la coordonnée du pixel
 * vers le centre de l'onde → les nuages semblent poussés vers l'extérieur.
 * L'intérieur de l'anneau est éclairci vers baseColor puis se referme.
 *
 * Toutes les positions sont en uv (0..1, origine en bas à gauche).
 */

const MAX = FOG_INTERACTION.maxRipples;
/** Nombre → littéral GLSL (toujours avec une décimale). */
const f = (n: number) => n.toFixed(3);
const CLEAR = f(FOG_INTERACTION.rippleClear);
const EDGE = f(FOG_INTERACTION.rippleEdge);
const POINTER_CLEAR = f(FOG_INTERACTION.pointerClear);

const UNIFORMS_GLSL = /* glsl */ `
uniform float iDpr;
uniform vec2 uPointer;
uniform float uStir;
uniform vec2 uParallax;
uniform float uPointerRadius;
#define MAX_RIPPLES ${MAX}
uniform vec4 uRipples[MAX_RIPPLES]; // xy = centre, z = âge (s), w = actif (0/1)
uniform float uRippleSpeed;
uniform float uRippleWidth;
uniform float uRippleLife;
uniform float uRippleForce;
`;

const DISPLACE_GLSL = /* glsl */ `
  vec2 res = iResolution.xy * iDpr;            // taille réelle du canvas (px)
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / res;
  vec2 aspect = vec2(res.x / res.y, 1.0);      // distances rondes, pas ovales
  vec2 push = vec2(0.0);
  float clearing = 0.0;
  float edge = 0.0;                            // densité ajoutée sur le front de l'onde

  // Remous autour du pointeur
  vec2 dp = (uv - uPointer) * aspect;
  float dpl = length(dp);
  float lens = exp(-(dpl * dpl) / (uPointerRadius * uPointerRadius)) * uStir;
  push += (dp / (dpl + 1e-4)) * lens * uPointerRadius * 0.5 / aspect;
  clearing += lens * ${POINTER_CLEAR};

  // Ondes de choc
  for (int i = 0; i < MAX_RIPPLES; i++) {
    vec4 rp = uRipples[i];
    if (rp.w < 0.5) continue;
    float life = clamp(rp.z / uRippleLife, 0.0, 1.0);
    float fade = 1.0 - life * life;            // reste fort longtemps, s'éteint à la fin
    float front = rp.z * uRippleSpeed;
    vec2 d = (uv - rp.xy) * aspect;
    float r = length(d);
    float ring = exp(-pow((r - front) / uRippleWidth, 2.0));
    push += (d / (r + 1e-4)) * ring * uRippleForce * fade / aspect;
    clearing += (1.0 - smoothstep(front * 0.55, front, r)) * fade * ${CLEAR};
    edge += ring * fade;
  }

  frag -= push * res;
  vec2 st = frag / iResolution.xy*3.;`;

/** [ligne d'origine, remplacement] — chaque ligne doit exister exactement une fois. */
const PATCHES: Array<[string, string]> = [
  ["uniform float zoom;", `uniform float zoom;\n${UNIFORMS_GLSL}`],
  ["vec2 st = gl_FragCoord.xy / iResolution.xy*3.;", DISPLACE_GLSL],
  ["st *= zoom;", "st *= zoom;\n  st += uParallax;"],
  [
    "gl_FragColor = vec4(finalColor,1.0);",
    `finalColor = mix(finalColor, baseColor, clamp(clearing, 0.0, 0.92));\n  finalColor = mix(finalColor, midtoneColor, clamp(edge * ${EDGE}, 0.0, 0.45));\n  gl_FragColor = vec4(finalColor,1.0);`,
  ],
];

export function patchFogSource(source: string): string {
  return PATCHES.reduce((src, [search, replacement]) => {
    if (src.split(search).length !== 2) {
      throw new Error(`[fogShader] ligne introuvable dans le shader Vanta : "${search}"`);
    }
    return src.replace(search, () => replacement);
  }, source);
}

export type FogUniforms = {
  uPointer: THREE.IUniform<THREE.Vector2>;
  uStir: THREE.IUniform<number>;
  uParallax: THREE.IUniform<THREE.Vector2>;
  uPointerRadius: THREE.IUniform<number>;
  uRipples: THREE.IUniform<THREE.Vector4[]>;
  uRippleSpeed: THREE.IUniform<number>;
  uRippleWidth: THREE.IUniform<number>;
  uRippleLife: THREE.IUniform<number>;
  uRippleForce: THREE.IUniform<number>;
};

function createUniforms(): FogUniforms {
  return {
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uStir: { value: 0 },
    uParallax: { value: new THREE.Vector2(0, 0) },
    uPointerRadius: { value: FOG_INTERACTION.pointerRadius },
    uRipples: { value: Array.from({ length: MAX }, () => new THREE.Vector4(0, 0, 0, 0)) },
    uRippleSpeed: { value: FOG_INTERACTION.rippleSpeed },
    uRippleWidth: { value: FOG_INTERACTION.rippleWidth },
    uRippleLife: { value: FOG_INTERACTION.rippleLife },
    uRippleForce: { value: FOG_INTERACTION.rippleForce },
  };
}

/**
 * Applique le patch sur un effet Vanta FOG déjà créé.
 * Renvoie les uniforms à piloter, ou null si le shader n'a pas la forme attendue
 * (ex. mise à jour de Vanta) : le fond reste alors affiché, sans interaction.
 */
export function patchFogEffect(scene: THREE.Scene): FogUniforms | null {
  const mesh = scene.children.find(
    (o): o is THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial> =>
      o instanceof THREE.Mesh && o.material instanceof THREE.ShaderMaterial,
  );
  if (!mesh) return null;

  try {
    const material = mesh.material;
    material.fragmentShader = patchFogSource(material.fragmentShader);
    const uniforms = createUniforms();
    // material.uniforms est le même objet que celui de Vanta : les couleurs
    // mises à jour par setOptions() continuent de fonctionner.
    Object.assign(material.uniforms, uniforms);
    material.needsUpdate = true;
    return uniforms;
  } catch (err) {
    console.warn(err);
    return null;
  }
}
