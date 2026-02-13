import { Request, Response } from "express";
import { healthService } from "../services/health-service";

export const healthController = {
    check: (_req: Request, res: Response) => {
        const status = healthService.check();

        res.status(200).json(status);
    }
}