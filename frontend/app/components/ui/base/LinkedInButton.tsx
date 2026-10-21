import { FaLinkedinIn } from "react-icons/fa6";
import { PROFILE } from "@/app/content/profile";
import SocialButton, { type SocialVariant } from "@/app/components/ui/base/SocialButton";

/** Bouton rond vers le profil LinkedIn (orange par défaut). */
export default function LinkedInButton({
  variant = "accent",
  className,
}: {
  variant?: SocialVariant;
  className?: string;
}) {
  return (
    <SocialButton
      href={PROFILE.linkedin}
      label="LinkedIn"
      icon={FaLinkedinIn}
      variant={variant}
      className={className}
    />
  );
}
