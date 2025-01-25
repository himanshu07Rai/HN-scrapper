import express, { Express } from "express";
import cors from "cors";
import logger from "./utils/logger";
import morgan from "morgan";

export const app: Express = express();
import { createServer } from "http";
const httpServer = createServer(app);
import { CONFIGS } from "@/config";
// import { APP_ISE, BIZ_ERROR, HTTP_CODE } from "./utils/konstants";
import { ApiErrorHandler } from "./types";
import { storyRoutes } from "./routes/stories";
import { scrapeHackerNewsJob } from "./cron-jobs";
import { connectWithRetry } from "./db";

const morganFormat = ":method :url :status :response-time ms";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

interface LogObject {
    method: string;
    url: string;
    status: string;
    responseTime: string;
}

app.use(
    morgan(morganFormat, {
        stream: {
            write: (message: string): void => {
                const logObject: LogObject = {
                    method: message.split(" ")[0]!,
                    url: message.split(" ")[1]!,
                    status: message.split(" ")[2]!,
                    responseTime: message.split(" ")[3]!
                };
                logger.info(JSON.stringify(logObject));
            }
        }
    })
);

app.get("/healthz", (_, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/stories", storyRoutes);

export function catcher(fn: Function) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}

const apiErrorHandler: ApiErrorHandler = function (err, req, res, next) {
    if (err) {
        logger.error(err);
        res.status(err.status || 500).json({
            status: "error",
            message: err.message,
            meta: err.meta || {}
        });
    }
};

app.use(apiErrorHandler);

app.on("error", (err) => {
    console.error("🔥 Global error caught:");
    logger.error(err);
});

process.on("uncaughtException", apiErrorHandler);

process.on("unhandledRejection", (reason, promise) => {
    if (reason instanceof Error) {
        reason.message = `Unhandled Rejection at: ${reason.message}`;
        logger.error(reason);
    } else {
        logger.warn(`Unhandled Rejection at: ${promise}, reason: ${JSON.stringify(reason)}`);
    }
});

process.on("warning", (warning) => {
    console.log(warning.name);
    console.log(warning.message);
});

const PORT: number | string = CONFIGS.PORT;

const shutdownGracefully = async () => {
    try {
        console.log("::> Shutting down server gracefully");
        await httpServer.close();
        process.exit(0);
    } catch (error) {
        console.error("::> Error shutting down server gracefully", error);
        process.exit(1);
    }
};

process.on("SIGTERM", shutdownGracefully);
process.on("SIGINT", shutdownGracefully);

connectWithRetry(() => {
    httpServer.listen(PORT, async () => {
        console.log(`::> Server running on PORT: ${PORT}`);
        try {
            // Start cron jobs or other background tasks after successful DB connection
            scrapeHackerNewsJob.start();
        } catch (error) {
            console.error("::> Error starting cron job", error);
        }
    });
});
