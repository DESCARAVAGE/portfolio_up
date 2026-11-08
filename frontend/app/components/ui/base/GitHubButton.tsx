import { FaGithub } from "react-icons/fa6";
import { LINKS } from "@/app/content/links";
import SocialButton, { type SocialVariant } from "@/app/components/ui/base/SocialButton";

/** Bouton rond vers le profil GitHub (encre pleine par défaut). */
export default function GitHubButton({ variant = "ink", className }: { variant?: SocialVariant; className?: string }) {
  return <SocialButton href={LINKS.github} label="GitHub" icon={FaGithub} variant={variant} className={className} />;
}
