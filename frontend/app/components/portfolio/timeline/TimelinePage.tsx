import LegalPage, { LegalSection } from "@/app/components/portfolio/legal/LegalPage";
import GanttChart from "@/app/components/portfolio/timeline/GanttChart";
import TimelineTable from "@/app/components/portfolio/timeline/TimelineTable";
import { TIMELINE_FIGURES, TIMELINE_UPDATED } from "@/app/content/timeline";
import type { Locale } from "@/app/i18n/config";
import { getUi } from "@/app/i18n/content";

/** Ancres des deux rubriques, dans chaque langue (/gantt#tableau, /en/gantt#table). */
const IDS: Record<Locale, { chart: string; table: string }> = {
  fr: { chart: "diagramme", table: "tableau" },
  en: { chart: "chart", table: "table" },
};

/**
 * Page /gantt (et /en/gantt) : la chronologie du projet, en diagramme de Gantt puis en
 * tableau. Même mise en page que les pages légales (retour au portfolio, langue, thème).
 */
export default function TimelinePage({ locale }: Readonly<{ locale: Locale }>) {
  const ui = getUi(locale);
  const t = ui.timeline;
  return (
    <LegalPage locale={locale} title={ui.legal.pages.gantt} updatedAt={TIMELINE_UPDATED}>
      <div className="flex flex-col gap-2">
        <p className="m-0 max-w-[65ch] text-lg leading-relaxed">{t.intro}</p>
        <p className="text-mute m-0 font-mono text-sm">
          {t.figures
            .replace("{commits}", String(TIMELINE_FIGURES.commits))
            .replace("{prs}", String(TIMELINE_FIGURES.prs))
            .replace("{versions}", String(TIMELINE_FIGURES.versions))}
        </p>
      </div>
      <LegalSection id={IDS[locale].chart} title={t.chart}>
        <GanttChart locale={locale} />
      </LegalSection>
      <LegalSection id={IDS[locale].table} title={t.table}>
        <TimelineTable locale={locale} />
      </LegalSection>
    </LegalPage>
  );
}
