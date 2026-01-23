import express from "express";
import cvRoutes from "./routes/cv.routes";
import healthRoute from "./routes/health.routes"

export function createApp() {
    const app = express();

    app.use(express.json());

    app.use("/api/", healthRoute);

    app.use("/api/cv", cvRoutes);

    return app;
}

export default createApp;