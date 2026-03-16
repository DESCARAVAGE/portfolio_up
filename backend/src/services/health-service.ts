export const healthService = {
    check: () => {
        const now = new Date();
        const date = now.toLocaleDateString("fr-FR", {
            timeZone: "Europe/Paris",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const time = now.toLocaleTimeString("fr-FR", {
            timeZone: "Europe/Paris",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });

        return {
            status: "ok",
            date,
            time,
        };
    },
};