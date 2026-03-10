// import { defineConfig } from 'vitest/config' 
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   base: './', // Important pour la prod, permet de ne pas charger une page blanche après le déploiement
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://backend:3001',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/,""),
//       },
//     },
//   },
//   plugins: [react()],
//   build: {
//     rollupOptions: {},
//     commonjsOptions: {
//       include: [/node_modules/],
//     },
//   },
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"), // Permet de nettoyer les chemins d'importations dans l'app et empeche plusieurs version des lib React principales de se retrouver dans bundle 
//     },
//     dedupe: ['react', 'react-dom', 'prop-types'],
//   },
//   optimizeDeps: {
//     include: ['react', 'react-dom', 'prop-types'],
//   }
// })
