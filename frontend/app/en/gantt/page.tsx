import type { Metadata } from "next";
import TimelinePage from "@/app/components/portfolio/timeline/TimelinePage";
import { PROFILE } from "@/app/content/profile";
import { languageAlternates } from "@/app/i18n/config";
import { getUi } from "@/app/i18n/content";

const ui = getUi("en");

export const metadata: Metadata = {
  title: `${ui.legal.pages.gantt} — ${PROFILE.fullName}`,
  description: ui.timeline.description,
  alternates: languageAlternates("gantt", "en"),
};

export default function Gantt() {
  return <TimelinePage locale="en" />;
}
