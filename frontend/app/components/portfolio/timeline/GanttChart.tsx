import {
  TIMELINE_MILESTONES,
  TIMELINE_PAUSE,
  TIMELINE_RANGE,
  TIMELINE_TASKS,
  TIMELINE_UPDATED,
  WEEKLY_COMMITS,
  type TimelineTask,
} from "@/app/content/timeline";
import type { Locale } from "@/app/i18n/config";
import { getUi } from "@/app/i18n/content";

/* Géométrie du dessin (unités du viewBox) : colonne des noms, puis la frise. */
const W = 1000;
const LABEL = 345;
const PAD_RIGHT = 16;
const TOP = 108;
const ROW = 28;
const DAY_MS = 864e5;

const day = (iso: string) =>
  (Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${TIMELINE_RANGE.start}T00:00:00Z`)) / DAY_MS;
const SPAN = day(TIMELINE_RANGE.end);
const x = (d: number) => LABEL + (d / SPAN) * (W - LABEL - PAD_RIGHT);

/** « 3 mars » / « Mar 3 » ; deux dates : « 3 mars → 5 mars ». */
export function formatRange(task: Pick<TimelineTask, "start" | "end">, locale: Locale): string {
  const f = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" });
  const d = (iso: string) => f.format(new Date(`${iso}T00:00:00Z`));
  return task.start === task.end ? d(task.start) : `${d(task.start)} → ${d(task.end)}`;
}

/**
 * Diagramme de Gantt de la chronologie, dessiné au rendu serveur (SVG, aucun JavaScript) :
 * commits par semaine en haut, jalons, puis une ligne par chantier. Le détail de chaque
 * barre est dans son infobulle (<title>) et dans le tableau qui suit le diagramme.
 */
export default function GanttChart({ locale }: Readonly<{ locale: Locale }>) {
  const t = getUi(locale).timeline;
  const height = TOP + TIMELINE_TASKS.length * ROW + 30;
  const bottom = height - 24;
  const month = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
  const maxWeek = Math.max(...WEEKLY_COMMITS);
  const weekWidth = (7 / SPAN) * (W - LABEL - PAD_RIGHT);
  const pause = [x(day(TIMELINE_PAUSE.start)), x(day(TIMELINE_PAUSE.end) + 1)] as const;
  // Premiers du mois compris dans la période (calculés depuis TIMELINE_RANGE)
  const months: string[] = [];
  for (let d = new Date(`${TIMELINE_RANGE.start}T00:00:00Z`); ;) {
    d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
    const iso = d.toISOString().slice(0, 10);
    if (iso >= TIMELINE_RANGE.end) break;
    months.push(iso);
  }
  // Libellé de chaque mois au milieu de sa portion visible (le premier mois commence à TIMELINE_RANGE.start)
  const monthLabels = [TIMELINE_RANGE.start, ...months].map((m, i, all) => ({
    m,
    at: (day(m) + (i + 1 < all.length ? day(all[i + 1]) : SPAN)) / 2,
  }));
  const today = x(day(TIMELINE_UPDATED) + 1);

  return (
    <div className="flex flex-col gap-3">
      {/* Zone qui peut défiler (petit écran) : atteignable au clavier, avec un nom */}
      <div
        role="region"
        aria-label={t.chart}
        tabIndex={0}
        className="overflow-x-auto rounded-2xl border border-[var(--line)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <svg
          viewBox={`0 0 ${W} ${height}`}
          role="img"
          aria-label={t.chartLabel}
          className="block w-full min-w-[52rem] font-sans text-[var(--ink)]"
        >
          <defs>
            <pattern id="tl-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="var(--line)" strokeWidth="3" />
            </pattern>
          </defs>

          {/* Pause sans commit */}
          <rect x={pause[0]} y={18} width={pause[1] - pause[0]} height={bottom - 18} fill="url(#tl-hatch)" />
          {/* Dans la bande des commits par semaine, vide pendant la pause */}
          <text x={(pause[0] + pause[1]) / 2} y={50} textAnchor="middle" fontSize="13" fill="var(--mute)">
            {t.pause.replace("{n}", String(TIMELINE_PAUSE.days))}
          </text>

          {/* Mois */}
          {months.map((m) => (
            <line key={m} x1={x(day(m))} x2={x(day(m))} y1={18} y2={bottom} stroke="var(--line)" strokeWidth="1" />
          ))}
          {monthLabels.map(({ m, at }) => (
            <text key={m} x={x(at)} y={height - 8} textAnchor="middle" fontSize="12" fill="var(--mute)">
              {month.format(new Date(`${m}T00:00:00Z`))}
            </text>
          ))}

          {/* Commits par semaine */}
          <text x={12} y={44} fontSize="12" fill="var(--mute)">
            {t.weekly}
          </text>
          {WEEKLY_COMMITS.map((n, i) =>
            n ? (
              <rect
                key={i}
                x={x(i * 7) + 1}
                y={66 - Math.max(2, (n / maxWeek) * 42)}
                width={Math.max(2, weekWidth - 2)}
                height={Math.max(2, (n / maxWeek) * 42)}
                rx="2"
                fill="var(--mute)"
                opacity="0.5"
              >
                <title>{`${n} commit${n > 1 ? "s" : ""}`}</title>
              </rect>
            ) : null,
          )}
          <line x1={LABEL} x2={W - PAD_RIGHT} y1={66.5} y2={66.5} stroke="var(--line)" />

          {/* Jalons */}
          <text x={12} y={90} fontSize="12" fill="var(--mute)">
            {t.milestones}
          </text>
          {TIMELINE_MILESTONES.map((m) => {
            const mx = x(day(m.date));
            return (
              <g key={m.date}>
                <path d={`M${mx} 80 L${mx + 6} 86 L${mx} 92 L${mx - 6} 86 Z`} fill="var(--accent)" />
                <line x1={mx} x2={mx} y1={93} y2={bottom} stroke="var(--accent)" strokeDasharray="2 4" opacity="0.5" />
                <text
                  x={m.align === "end" ? mx - 10 : mx + 10}
                  y={90}
                  textAnchor={m.align === "end" ? "end" : "start"}
                  fontSize="12"
                  fontWeight="600"
                  fill="var(--ink)"
                >
                  {m.label[locale]}
                </text>
              </g>
            );
          })}

          {/* Chantiers */}
          {TIMELINE_TASKS.map((task, i) => {
            const y = TOP + i * ROW;
            const x0 = x(day(task.start));
            const w = Math.max(7, x(day(task.end) + 1) - x0);
            const dates = formatRange(task, locale);
            const right = x0 + w + 8 + 140 <= W;
            return (
              <g key={task.name.fr}>
                <text x={12} y={y + 4} fontSize="14" fill="var(--ink)">
                  {task.name[locale].length > 44 ? `${task.name[locale].slice(0, 43)}…` : task.name[locale]}
                </text>
                <rect x={x0} y={y - 7} width={w} height={14} rx="4" fill={`var(--tl-${task.cat})`}>
                  <title>{`${task.name[locale]} · ${dates}${task.prs ? ` · PR ${task.prs}` : ""}`}</title>
                </rect>
                <text
                  x={right ? x0 + w + 8 : x0 - 8}
                  y={y + 4}
                  textAnchor={right ? "start" : "end"}
                  fontSize="12"
                  fill="var(--mute)"
                  className="font-mono"
                >
                  {dates}
                </text>
              </g>
            );
          })}

          {/* Dernier commit relevé */}
          <line x1={today} x2={today} y1={18} y2={bottom} stroke="var(--ink)" opacity="0.35" />
        </svg>
      </div>
      {/* Légende des couleurs (chaque barre a aussi son nom écrit) */}
      <div className="text-mute flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {(Object.keys(t.cats) as (keyof typeof t.cats)[]).map((c) => (
          <span key={c} className="inline-flex items-center gap-2">
            <span aria-hidden className="h-3 w-3 shrink-0 rounded-[3px]" style={{ background: `var(--tl-${c})` }} />
            {t.cats[c]}
          </span>
        ))}
        <span className="w-full text-xs sm:hidden">{t.scroll}</span>
      </div>
    </div>
  );
}
