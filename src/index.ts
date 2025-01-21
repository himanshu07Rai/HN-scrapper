import express, { Express } from "express";
import cors from "cors";

const app: Express = express();
import { createServer } from "http";
const httpServer = createServer(app);
import { CONFIGS } from "@/config";
import { scrapeHackerNewsJob } from "./cron-jobs";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/healthz", (_, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT: number | string = CONFIGS.PORT;

httpServer.listen(PORT, async () => {
    console.log(`::> Server running on PORT: ${PORT}`);
    scrapeHackerNewsJob.start();
});
