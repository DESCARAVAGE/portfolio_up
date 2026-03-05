//TODO fix the Date (+1h for france)
export const healthService = {
    check: () => {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
        };
    },
};