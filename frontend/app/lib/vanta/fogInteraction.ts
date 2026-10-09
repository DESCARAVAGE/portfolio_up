import { FOG_INTERACTION } from "@/app/lib/vanta/fogConfig";
import type { FogUniforms } from "@/app/lib/vanta/fogShader";

type Ripple = { x: number; y: number; age: number; active: boolean };

const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);

/**
 * État de l'interaction (aucune dépendance au DOM).
 * - move(x, y)  : le pointeur bouge → remous + parallaxe
 * - burst(x, y) : clic / tap → nouvelle onde de choc
 * - update()    : appelé à chaque frame par Vanta, écrit dans les uniforms
 * Coordonnées en uv : 0..1, origine en bas à gauche.
 */
export class FogInteraction {
  private cfg = FOG_INTERACTION;
  private target = { x: 0.5, y: 0.5 };
  private pointer = { x: 0.5, y: 0.5 };
  private parallax = { x: 0, y: 0 };
  private stir = 0;
  private hasPointer = false;
  private last = performance.now();
  private ripples: Ripple[] = Array.from({ length: FOG_INTERACTION.maxRipples }, () => ({
    x: 0,
    y: 0,
    age: 0,
    active: false,
  }));

  constructor(private uniforms: FogUniforms) {}

  move(x: number, y: number) {
    if (this.hasPointer) {
      const dist = Math.hypot(x - this.target.x, y - this.target.y);
      this.stir = Math.min(1, this.stir + dist * this.cfg.stirGain);
    } else {
      // premier mouvement : on se place sans créer de remous
      this.pointer = { x, y };
      this.hasPointer = true;
    }
    this.target = { x, y };
  }

  burst(x: number, y: number) {
    // une case libre, sinon on recycle l'onde la plus ancienne
    const slot =
      this.ripples.find((r) => !r.active) ??
      this.ripples.reduce((oldest, r) => (r.age > oldest.age ? r : oldest), this.ripples[0]);
    Object.assign(slot, { x, y, age: 0, active: true });
  }

  update() {
    const now = performance.now();
    const dt = Math.min((now - this.last) / 1000, 0.1); // évite un saut après un onglet en pause
    this.last = now;
    const { cfg, uniforms: u } = this;

    // Le pointeur affiché suit la cible en douceur
    const k = damp(cfg.follow, dt);
    this.pointer.x += (this.target.x - this.pointer.x) * k;
    this.pointer.y += (this.target.y - this.pointer.y) * k;

    // Le remous retombe quand on ne bouge plus
    this.stir *= Math.exp(-cfg.stirDecay * dt);

    // Le brouillard glisse légèrement dans le sens du pointeur
    const px = this.hasPointer ? (0.5 - this.pointer.x) * cfg.parallax : 0;
    const py = this.hasPointer ? (0.5 - this.pointer.y) * cfg.parallax : 0;
    const kp = damp(cfg.follow * 0.4, dt);
    this.parallax.x += (px - this.parallax.x) * kp;
    this.parallax.y += (py - this.parallax.y) * kp;

    u.uPointer.value.set(this.pointer.x, this.pointer.y);
    u.uStir.value = this.stir;
    u.uParallax.value.set(this.parallax.x, this.parallax.y);

    this.ripples.forEach((r, i) => {
      if (r.active) {
        r.age += dt;
        if (r.age > cfg.rippleLife) r.active = false;
      }
      u.uRipples.value[i].set(r.x, r.y, r.age, r.active ? 1 : 0);
    });
  }
}
