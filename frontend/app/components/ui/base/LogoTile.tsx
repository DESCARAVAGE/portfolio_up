import Image from "next/image";
import type { Img } from "@/app/content/profile";

/**
 * Logo posé sur une pastille blanche : les logos d'école ou d'entreprise sont
 * pensés pour un fond clair, la pastille les garde lisibles dans les deux thèmes.
 *
 * Le logo est toujours affiché à côté du nom écrit en toutes lettres : il est donc
 * décoratif (alt=""), sinon un lecteur d'écran lirait le nom deux fois.
 */
export default function LogoTile({ logo, className = "" }: { logo: Img; className?: string }) {
  return (
    <span
      className={`inline-flex h-12 w-fit items-center rounded-xl bg-white px-3 shadow-sm ring-1 ring-black/5 ${className}`}
    >
      {/* Image importée : Next connaît ses vraies dimensions, pas besoin de width / height */}
      <Image src={logo.src} alt="" sizes="160px" className="h-7 w-auto object-contain" />
    </span>
  );
}
