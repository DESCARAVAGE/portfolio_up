export const paths = {
    landing: '/',
    home: '/home',
    xpDetails: (xpId: string) => `./xp-details/${xpId}`,
    goals: (goalId: string) => `/goals/${goalId}`,
};