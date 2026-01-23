// env tu mets les URL de la db, les port etc
// bah pour moi le env.ts c'est la que tu va gerer la recuperation des variables environnement dont celle du .env si y'en a un

export const env = {
    port: Number(process.env.PORT) || 3001,
    
    routes: {
        healthCheck: '/api/health',
        cvDownload: '/api/cv/download',
    },
};