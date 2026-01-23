export const healthService = {
    check: () => {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
        };
    },
};