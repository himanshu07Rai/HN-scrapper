import mysql, { PoolOptions } from "mysql2/promise";
import { CONFIGS } from "@/config";

const pool = mysql.createPool({
    ...(CONFIGS.DATABASE as PoolOptions)
});

interface ConnectWithRetry {
    (resolve?: () => void): Promise<void>;
}

const connectWithRetry: ConnectWithRetry = async (resolve) => {
    try {
        console.log("Attempting to establish a database connection...");
        const connection = await pool.getConnection();
        console.log("Database connection established.");
        connection.release();
        if (resolve) resolve();
    } catch (err: any) {
        console.error("Database connection failed:", err.message);
        console.log("Retrying in 5 seconds...");
        setTimeout(() => connectWithRetry(resolve), 5000);
    }
};

export { connectWithRetry, pool };
