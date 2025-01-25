import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize } = format;
import { CONFIGS } from "@/config";

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
    format.colorize(),
    format.printf(({ level, message, timestamp }) => {
        return `${timestamp} => ${level}: ${message}`;
    })
);

// Create a Winston logger
const logger = createLogger({
    level: CONFIGS.LOG_LEVEL || "info",
    format: combine(colorize(), timestamp(), json()),
    transports: [
        new transports.Console({
            format: consoleLogFormat
        }),
        new transports.File({ filename: "app.log" })
    ]
});

export default logger;
