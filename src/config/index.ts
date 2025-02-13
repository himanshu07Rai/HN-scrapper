/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv";

dotenv.config();

// How to use this:
// ============================================================
// This file is used to store all the environment variables and constants used in the application.

// # To add a new variable:
// ============================================================
// - For environment variables & constants that are the same across all environments, add them to the GLOBAL_CONSTANTS object.
// - For environment-specific variables (i.e they change depending on the environemnt), add them to the environment's object in each of the CONFIG_BUILDER object.

// # To add a new environment:
// ============================================================
// 1. Add a new key to the CONFIG_BUILDER object with the environment name.
// 2. Duplicate the development object and replace the values with the new environment's values.

const DEPLOYMENT_ENV = process.env.NODE_ENV || "dev";

const GLOBAL_CONSTANTS = {
    APP_NAME: "hacker-news-scraper",
    PORT: process.env.PORT || 5000,
    SCRAPE_INTERVAL: parseInt(process.env.SCRAPE_INTERVAL!) || 18000,
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    MONGO_URI: process.env.MONGO_URI || "mongodb://jon_snow:ygritte@localhost:27017/got_db",
    DATABASE: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT!) || 10,
        waitForConnections: process.env.DATABASE_WAIT_FOR_CONNECTIONS === "true",
        queueLimit: parseInt(process.env.DATABASE_QUEUE_LIMIT!) || 0,
        enableKeepAlive: process.env.DATABASE_ENABLE_KEEP_ALIVE === "true",
        keepAliveInitialDelay: parseInt(process.env.DATABASE_KEEP_ALIVE_INITIAL_DELAY!) || 0
    },
    HACKER_NEWS: {
        BASE_URL: "https://news.ycombinator.com",
        NEWEST_URL: "https://news.ycombinator.com/newest"
    }
};

const CONFIG_BUILDER = {
    dev: {
        ...GLOBAL_CONSTANTS,

        CORS_ALLOWED_ORIGINS: ["https://admin.socket.io", "http://localhost:3000"],

        SOCKET_IO: {
            USERNAME: "admin",
            PASSWORD: "password"
        }

        // e.g
        // API_SERVICE: {
        //     PUBLIC_KEY: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        //     SECRET_KEY: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        // },
    },

    prod: {
        ...GLOBAL_CONSTANTS,

        CORS_ALLOWED_ORIGINS: ["https://admin.socket.io", "http://hacker-news-scraper.com"],

        SOCKET_IO: {
            USERNAME: process.env.SOCKET_IO_USERNAME!,
            PASSWORD: process.env.SOCKET_IO_PASSWORD!
        }

        // e.g
        // API_SERVICE: {
        //     PUBLIC_KEY: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        //     SECRET_KEY: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        // },
    }
} as const;

// Check if DEPLOYMENT_ENV is valid
if (!Object.keys(CONFIG_BUILDER).includes(DEPLOYMENT_ENV)) {
    throw new Error(`Invalid NODE_ENV: ${DEPLOYMENT_ENV}`);
}

const CONFIGS = CONFIG_BUILDER[DEPLOYMENT_ENV as keyof typeof CONFIG_BUILDER];

// Uncomment below to check configs set
// console.log("CONFIGS:", CONFIGS);

export { DEPLOYMENT_ENV, CONFIGS };
