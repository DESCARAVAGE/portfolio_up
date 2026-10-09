import { CONTACT, PROFILE } from "@/app/content/profile";
import Surface from "@/app/components/ui/base/Surface";
import Reveal from "@/app/components/ui/motion/Reveal";
import ScrollSlide from "@/app/components/ui/motion/ScrollSlide";
import CopyEmail from "@/app/components/ui/base/CopyEmail";

const pill = "rounded-full px-5 py-3 font-medium transition-transform hover:-translate-y-0.5";

/**
 * Effet — l'énorme « on en parle ? » entre par la droite au rythme du scroll ;
 * la carte pleine (pitch, infos pratiques, liens) monte en dessous.
 */
export default function ContactFooter() {
  return (
    <footer
      id="contact"
      className="relative flex flex-col gap-12 overflow-hidden border-t border-[var(--line)] px-[4%] pt-20 pb-10 md:gap-16 md:pt-24"
    >
      <h2 className="m-0 font-[inherit]">
        <ScrollSlide>
          <a
            href={`mailto:${PROFILE.email}`}
            className="block text-[clamp(3.5rem,12vw,12rem)] leading-[0.9] font-semibold tracking-[-0.055em] whitespace-nowrap lowercase transition-colors hover:text-[var(--accent)]"
          >
            {CONTACT.headline}
          </a>
        </ScrollSlide>
      </h2>

      <Reveal effect="lift" amount={0.3}>
        <Surface
          variant="solid"
          radius="1.75rem"
          contentClassName="flex flex-wrap items-start justify-between gap-10 p-9 sm:p-12"
        >
          <div className="flex max-w-lg flex-[1_1_20rem] flex-col gap-6">
            <p className="m-0 text-xl leading-snug">{CONTACT.pitch}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${PROFILE.email}`}
                className={`${pill} bg-[var(--accent-surface)] text-[var(--accent-ink)]`}
              >
                M&apos;écrire
              </a>
              <a
                href={PROFILE.cv}
                download={PROFILE.cvFileName}
                className={`${pill} border border-[color-mix(in_srgb,currentColor_35%,transparent)]`}
              >
                Mon CV <span aria-hidden>↓</span>
              </a>
            </div>
          </div>

          <div className="flex flex-[1_1_18rem] flex-col gap-6">
            <dl className="m-0 flex flex-col gap-4">
              {CONTACT.practical.map((p) => (
                <div key={p.label} className="flex flex-col gap-1">
                  <dt className="text-mute font-mono text-xs tracking-wider uppercase">{p.label}</dt>
                  <dd className="m-0 font-medium">{p.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3 font-mono text-sm">
              <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <a href={`mailto:${PROFILE.email}`} className="underline-offset-4 hover:underline">
                  {PROFILE.email}
                </a>
                <CopyEmail
                  email={PROFILE.email}
                  className="rounded-full border border-[color-mix(in_srgb,currentColor_30%,transparent)] px-3 py-1.5 text-xs transition-colors hover:border-current"
                />
              </span>
              <span className="flex flex-wrap gap-x-6 gap-y-2">
                {PROFILE.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    {s.label} <span aria-hidden>↗</span>
                    <span className="sr-only"> (nouvel onglet)</span>
                  </a>
                ))}
              </span>
            </div>
          </div>
        </Surface>
      </Reveal>

      <span className="text-mute font-mono text-xs">
        © {PROFILE.year} {PROFILE.fullName}
      </span>
    </footer>
  );
}
