import { FOG_RENDER, type FogColors } from "@/app/lib/fog/fogConfig";
import { FRAGMENT_SHADER, VERTEX_SHADER, createFogState } from "@/app/lib/fog/fogShader";
import { FogInteraction } from "@/app/lib/fog/fogInteraction";

/**
 * Moteur du brouillard : WebGL brut, sans bibliothèque.
 * Ce fichier n'est importé que dynamiquement (voir useFog) : il ne pèse rien
 * au chargement de la page.
 *
 * Tout est réglé pour tenir le moins de mémoire possible, ce qui compte surtout
 * sur iPhone, où le système recharge l'onglet quand la page en prend trop :
 * - contexte WebGL minimal : ni transparence, ni anticrénelage, ni tampon de
 *   profondeur ou de stencil (un seul triangle plein écran n'en a pas besoin) ;
 * - canvas calculé en basse résolution (voir FOG_RENDER), étiré par le navigateur ;
 * - jamais réalloué quand seule la hauteur diminue (barre d'adresse d'iOS qui
 *   apparaît et disparaît pendant le défilement) : le bas du canvas est rogné ;
 * - 30 images par seconde, et aucune quand l'onglet est caché ;
 * - si le système reprend le contexte WebGL, le canvas disparaît et le fond CSS reste.
 */

export type FogHandle = {
  /** Contrôleur des remous et des ondes. */
  interaction: FogInteraction;
  setColors: (colors: FogColors) => void;
  destroy: () => void;
};

const COLOR_UNIFORMS = {
  baseColor: "uBase",
  lowlightColor: "uLowlight",
  midtoneColor: "uMidtone",
  highlightColor: "uHighlight",
} as const satisfies Record<keyof FogColors, string>;

const CONTEXT_OPTIONS: WebGLContextAttributes = {
  alpha: false,
  antialias: false,
  depth: false,
  stencil: false,
  preserveDrawingBuffer: false,
  powerPreference: "low-power",
};

/** Un triangle qui déborde de l'écran le couvre entièrement (moins de sommets qu'un rectangle). */
const FULLSCREEN_TRIANGLE = new Float32Array([-1, -1, 3, -1, -1, 3]);

const hexToRgb = (hex: number): [number, number, number] => [
  ((hex >> 16) & 255) / 255,
  ((hex >> 8) & 255) / 255,
  (hex & 255) / 255,
];

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  if (process.env.NODE_ENV !== "production") console.warn("[fog]", gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = vs && fs ? gl.createProgram() : null;
  if (program && vs && fs) {
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
  }
  // Les shaders ne servent plus une fois liés au programme
  if (vs) gl.deleteShader(vs);
  if (fs) gl.deleteShader(fs);
  if (program && gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  if (program) gl.deleteProgram(program);
  return null;
}

/**
 * Crée le brouillard dans `el`. Renvoie null si WebGL est indisponible :
 * le fond CSS de secours reste alors affiché, sans erreur dans la console.
 * `onLost` est appelé si le système reprend le contexte WebGL (mémoire).
 */
export function createFog(el: HTMLElement, colors: FogColors, onLost?: () => void): FogHandle | null {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", CONTEXT_OPTIONS);
  if (!gl) return null;

  const program = createProgram(gl);
  if (!program) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_TRIANGLE, gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    resolution: u("uResolution"),
    density: u("uDensity"),
    time: u("uTime"),
    pointer: u("uPointer"),
    stir: u("uStir"),
    parallax: u("uParallax"),
    ripples: u("uRipples"),
  };

  const state = createFogState();
  const interaction = new FogInteraction(state);

  // --- Taille ---------------------------------------------------------------
  let cssW = 0;
  let cssH = 0;

  /** Réalloue le canvas si besoin. Renvoie true s'il a été réalloué (et donc effacé). */
  const resize = (): boolean => {
    const w = Math.max(el.clientWidth, 1);
    const h = Math.max(el.clientHeight, 1);
    // Hauteur seule qui diminue : on garde le canvas, son bas est simplement rogné
    if (w === cssW && h <= cssH) return false;
    cssW = w;
    cssH = h;

    const dpr = window.devicePixelRatio || 1;
    const mobile = window.matchMedia("(pointer: coarse)").matches || w < 600;
    const ratio = Math.min(
      dpr / (mobile ? FOG_RENDER.scaleMobile : FOG_RENDER.scale),
      Math.sqrt(FOG_RENDER.maxPixels / (w * h)),
    );
    canvas.width = Math.max(1, Math.round(w * ratio));
    canvas.height = Math.max(1, Math.round(h * ratio));
    canvas.style.height = `${h}px`;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(loc.resolution, canvas.width, canvas.height);
    gl.uniform1f(loc.density, dpr);
    return true;
  };

  // --- Rendu ----------------------------------------------------------------
  const frameMs = 1000 / FOG_RENDER.fps;
  let time = 0;
  let last = 0;
  let raf = 0;
  let running = false;
  let lost = false;

  const draw = () => {
    interaction.update();
    gl.uniform1f(loc.time, time);
    gl.uniform2fv(loc.pointer, state.pointer);
    gl.uniform1f(loc.stir, state.stir);
    gl.uniform2fv(loc.parallax, state.parallax);
    gl.uniform4fv(loc.ripples, state.ripples);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    // L'écran rafraîchit à 60-120 Hz : on ne calcule qu'une image toutes les ~33 ms
    if (last && now - last < frameMs * 0.9) return;
    time += last ? (Math.min(now - last, 100) / 1000) * FOG_RENDER.speed : 0;
    last = now;
    draw();
  };

  const start = () => {
    if (running || lost || document.hidden) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // --- Événements -----------------------------------------------------------
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  const observer = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    // Attendre la fin d'un redimensionnement de fenêtre : une seule réallocation
    resizeTimer = setTimeout(() => {
      if (!lost && resize()) draw();
    }, 150);
  });

  const onVisibility = () => (document.hidden ? stop() : start());

  const release = () => {
    stop();
    clearTimeout(resizeTimer);
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.remove();
  };

  // Le système a repris la mémoire du GPU : on s'efface, le fond CSS prend le relais
  const onContextLost = () => {
    lost = true;
    release();
    onLost?.();
  };

  const setColors = (c: FogColors) => {
    if (lost) return;
    for (const key of Object.keys(COLOR_UNIFORMS) as Array<keyof FogColors>) {
      gl.uniform3fv(u(COLOR_UNIFORMS[key]), hexToRgb(c[key]));
    }
    if (!running) draw(); // en pause : afficher tout de suite la nouvelle palette
  };

  // --- Démarrage ------------------------------------------------------------
  Object.assign(canvas.style, { position: "absolute", top: "0", left: "0", width: "100%", minHeight: "100%" });
  el.appendChild(canvas);
  resize();
  setColors(colors); // dessine aussi la première image, avant le fondu d'apparition
  start();

  observer.observe(el);
  canvas.addEventListener("webglcontextlost", onContextLost);
  document.addEventListener("visibilitychange", onVisibility);

  return {
    interaction,
    setColors,
    destroy() {
      if (lost) return;
      release();
      // Libère tout de suite la mémoire du GPU (sans attendre le ramasse-miettes)
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
