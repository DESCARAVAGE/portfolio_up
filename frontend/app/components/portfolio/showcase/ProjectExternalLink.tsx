"use client";

import type { ReactNode } from "react";
import posthog from "posthog-js";
import NewTabNote from "@/app/components/ui/base/NewTabNote";

export default function ProjectExternalLink({
  children,
  href,
  linkLabel,
  projectTitle,
}: Readonly<{
  children: ReactNode;
  href: string;
  linkLabel: string;
  projectTitle: string;
}>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => posthog.capture("project_link_opened", { project_title: projectTitle, link_label: linkLabel })}
      className="rounded-full border border-[color-mix(in_srgb,currentColor_30%,transparent)] px-4 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5"
    >
      {children}
      <span aria-hidden>↗</span>
      <NewTabNote />
    </a>
  );
}
