import { FOG_INTERACTION } from "@/app/lib/fog/fogConfig";

/**
 * Shaders du brouillard.
 *
 * Le brouillard est un seul triangle qui couvre l'écran : tout le travail est fait
 * par le fragment shader, pixel par pixel. Il reprend l'effet FOG de Vanta.js
 * (MIT, Teng Bao), lui-même tiré de The Book of Shaders (Patricio Gonzalez Vivo) :
 * du bruit fractal (fbm) déformé deux fois par lui-même, puis colorié avec 4 couleurs.
 *
 * On y ajoute l'interaction :
 * - un remous autour du pointeur + un léger parallaxe global ;
 * - des ondes de choc (clic / tap) qui repoussent les nuages vers l'extérieur.
 * Principe : avant d'échantillonner le bruit, on décale la coordonnée du pixel
 * vers le centre de l'onde → les nuages semblent poussés vers l'extérieur.
 * L'intérieur de l'anneau est éclairci vers la couleur de fond, puis se referme.
 *
 * Toutes les positions sont en uv (0..1, origine en bas à gauche).
 */

const MAX = FOG_INTERACTION.maxRipples;
/** Nombre → littéral GLSL (toujours avec une décimale). */
const f = (n: number) => n.toFixed(3);

export const VERTEX_SHADER = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

export const FRAGMENT_SHADER = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uResolution;   // taille du canvas en pixels
uniform float uDensity;     // devicePixelRatio : même grain de nuage qu'avec Vanta
uniform float uTime;        // secondes
uniform vec3 uBase;
uniform vec3 uLowlight;
uniform vec3 uMidtone;
uniform vec3 uHighlight;

uniform vec2 uPointer;
uniform float uStir;
uniform vec2 uParallax;
#define MAX_RIPPLES ${MAX}
uniform vec4 uRipples[MAX_RIPPLES]; // xy = centre, z = âge (s), w = actif (0/1)

#define BLUR ${f(0.6)}
#define NUM_OCTAVES 6
#define POINTER_RADIUS ${f(FOG_INTERACTION.pointerRadius)}
#define RIPPLE_SPEED ${f(FOG_INTERACTION.rippleSpeed)}
#define RIPPLE_WIDTH ${f(FOG_INTERACTION.rippleWidth)}
#define RIPPLE_LIFE ${f(FOG_INTERACTION.rippleLife)}
#define RIPPLE_FORCE ${f(FOG_INTERACTION.rippleForce)}
#define RIPPLE_CLEAR ${f(FOG_INTERACTION.rippleClear)}
#define RIPPLE_EDGE ${f(FOG_INTERACTION.rippleEdge)}
#define POINTER_CLEAR ${f(FOG_INTERACTION.pointerClear)}

float random(in vec2 st) {
  return fract(sin(dot(st.xy, vec2(0.129898, 0.78233))) * 437.585453123);
}

// Bruit de valeur 2D (Morgan McGuire, https://www.shadertoy.com/view/4dS3Wd)
float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 fr = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = fr * fr * (3.0 - 2.0 * fr);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(in vec2 st) {
  float v = 0.0;
  float a = BLUR;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5)); // évite les motifs alignés
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(st);
    st = rot * st * 2.0 + shift;
    a *= (1.0 - BLUR);
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0); // distances rondes, pas ovales
  vec2 push = vec2(0.0);
  float clearing = 0.0;
  float edge = 0.0;                                       // densité ajoutée sur le front de l'onde

  // Remous autour du pointeur
  vec2 dp = (uv - uPointer) * aspect;
  float dpl = length(dp);
  float lens = exp(-(dpl * dpl) / (POINTER_RADIUS * POINTER_RADIUS)) * uStir;
  push += (dp / (dpl + 1e-4)) * lens * POINTER_RADIUS * 0.5 / aspect;
  clearing += lens * POINTER_CLEAR;

  // Ondes de choc
  for (int i = 0; i < MAX_RIPPLES; i++) {
    vec4 rp = uRipples[i];
    if (rp.w < 0.5) continue;
    float life = clamp(rp.z / RIPPLE_LIFE, 0.0, 1.0);
    float fade = 1.0 - life * life;                       // reste fort longtemps, s'éteint à la fin
    float front = rp.z * RIPPLE_SPEED;
    vec2 d = (uv - rp.xy) * aspect;
    float r = length(d);
    float ring = exp(-pow((r - front) / RIPPLE_WIDTH, 2.0));
    push += (d / (r + 1e-4)) * ring * RIPPLE_FORCE * fade / aspect;
    clearing += (1.0 - smoothstep(front * 0.55, front, r)) * fade * RIPPLE_CLEAR;
    edge += ring * fade;
  }

  // Coordonnées du bruit (mêmes proportions que l'effet Vanta d'origine)
  vec2 st = (uv - push) * 3.0 * uDensity;
  st.x *= 0.7 * aspect.x;                                 // un peu plus large que haut
  st += uParallax;

  vec2 q = vec2(fbm(st), fbm(st + vec2(1.0)));
  vec2 dir = vec2(0.15, 0.126);
  vec2 r = vec2(
    fbm(st + q + vec2(1.7, 9.2) + dir.x * uTime),
    fbm(st + q + vec2(8.3, 2.8) + dir.y * uTime)
  );
  float fv = fbm(st + r);

  vec3 color = mix(uBase, uLowlight, clamp(fv * fv * 4.0, 0.0, 1.0));
  color = mix(color, uMidtone, clamp(length(q), 0.0, 1.0));
  color = mix(color, uHighlight, clamp(length(r.x), 0.0, 1.0));
  vec3 finalColor = mix(uBase, color, fv * fv * fv + 0.6 * fv * fv + 0.5 * fv);

  finalColor = mix(finalColor, uBase, clamp(clearing, 0.0, 0.92));
  finalColor = mix(finalColor, uMidtone, clamp(edge * RIPPLE_EDGE, 0.0, 0.45));
  gl_FragColor = vec4(finalColor, 1.0);
}`;

/**
 * État de l'interaction, écrit par FogInteraction et envoyé au shader à chaque image.
 * Des tableaux simples, réutilisés : aucune allocation par image.
 */
export type FogState = {
  pointer: Float32Array; // x, y
  parallax: Float32Array; // x, y
  ripples: Float32Array; // MAX × (x, y, âge, actif)
  stir: number;
};

export function createFogState(): FogState {
  return {
    pointer: new Float32Array([0.5, 0.5]),
    parallax: new Float32Array(2),
    ripples: new Float32Array(MAX * 4),
    stir: 0,
  };
}
