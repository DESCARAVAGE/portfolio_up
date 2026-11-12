"use client";

import type { ReactNode } from "react";
import posthog from "posthog-js";

type ContactAction = "email" | "resume";

export default function ContactActionLink({
  action,
  children,
  className,
  download,
  href,
  placement,
}: Readonly<{
  action: ContactAction;
  children: ReactNode;
  className: string;
  download?: string;
  href: string;
  placement: string;
}>) {
  const capture = () => {
    if (action === "email") {
      posthog.capture("contact_email_opened", { placement });
      return;
    }

    posthog.capture("resume_downloaded", { placement });
  };

  return (
    <a href={href} download={download} onClick={capture} className={className}>
      {children}
    </a>
  );
}
