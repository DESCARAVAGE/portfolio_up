import { SeverityNumber } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const missingVariable = token ? "NEXT_PUBLIC_POSTHOG_HOST" : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";

export const posthogLogProvider =
  token && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({ "service.name": "portfolio-frontend" }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${host.replace(/\/$/, "")}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          }),
        ],
      })
    : null;

const posthogLogger = posthogLogProvider?.getLogger("portfolio-frontend.posthog");

export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  if (!posthogLogger) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }
    return;
  }

  posthogLogger.emit({
    body: "PostHog log exporter configured for the portfolio server",
    severityNumber: SeverityNumber.INFO,
    attributes: { component: "instrumentation", event_name: "posthog_log_exporter_configured" },
  });
  posthogLogger.emit({
    body: "Portfolio server Node runtime registered",
    severityNumber: SeverityNumber.INFO,
    attributes: { component: "instrumentation", event_name: "portfolio_server_runtime_registered" },
  });
}
