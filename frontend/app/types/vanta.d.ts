// Vanta n'a pas de types : on déclare juste sa forme. Le retour est `unknown`,
// createFog.ts le convertit en un type précis (VantaEffect).
declare module "vanta/dist/vanta.fog.min" {
  const FOG: (options: Record<string, unknown>) => unknown;
  export default FOG;
}
