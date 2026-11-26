import { TIMELINE_TASKS } from "@/app/content/timeline";
import type { Locale } from "@/app/i18n/config";
import { getUi } from "@/app/i18n/content";
import { formatRange } from "@/app/components/portfolio/timeline/GanttChart";

/**
 * La chronologie en tableau : même contenu que le diagramme, lisible au clavier et par les
 * lecteurs d'écran. Les messages de commit sont cités tels quels (translate="no").
 */
export default function TimelineTable({ locale }: Readonly<{ locale: Locale }>) {
  const t = getUi(locale).timeline;
  const th = "text-mute py-2 pr-4 text-left align-bottom font-mono text-xs font-normal tracking-wider uppercase";
  const td = "border-t border-[var(--line)] py-3 pr-4 align-top";
  return (
    // Zone qui peut défiler (petit écran) : atteignable au clavier, avec un nom
    <div
      role="region"
      aria-label={t.table}
      tabIndex={0}
      className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <table className="w-full min-w-[40rem] border-collapse text-[0.9375rem]">
        <thead>
          <tr>
            <th scope="col" className={th}>
              {t.cols.task}
            </th>
            <th scope="col" className={th}>
              {t.cols.type}
            </th>
            <th scope="col" className={th}>
              {t.cols.dates}
            </th>
            <th scope="col" className={th}>
              {t.cols.prs}
            </th>
            <th scope="col" className={th}>
              {t.cols.commits}
            </th>
          </tr>
        </thead>
        <tbody>
          {TIMELINE_TASKS.map((task) => (
            <tr key={task.name.fr}>
              <th scope="row" className={`${td} text-left font-medium`}>
                {task.name[locale]}
                {task.live && <span className="text-mute font-normal"> ({t.inProgress})</span>}
              </th>
              <td className={td}>
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-3 w-3 shrink-0 rounded-[3px]"
                    style={{ background: `var(--tl-${task.cat})` }}
                  />
                  {t.cats[task.cat]}
                </span>
              </td>
              <td className={`${td} font-mono text-sm whitespace-nowrap`}>{formatRange(task, locale)}</td>
              <td className={`${td} font-mono text-sm whitespace-nowrap`} translate="no">
                {task.prs || "—"}
              </td>
              <td className={`${td} text-sm`}>
                <ul className="m-0 flex list-none flex-col gap-1 p-0">
                  {task.commits.map(([hash, message]) => (
                    <li key={hash}>
                      <code className="text-mute">{hash}</code> <span translate="no">{message}</span>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
