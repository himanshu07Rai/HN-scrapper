import mongoose from "mongoose";
import { CONFIGS } from "@/config";

const connectWithRetry = async (resolve?: () => void): Promise<void> => {
    try {
        console.log("Attempting to establish a MongoDB connection...");
        await mongoose.connect(CONFIGS.MONGO_URI, {});
        console.log("MongoDB connection established.");
        if (resolve) resolve();
    } catch (err: any) {
        console.error("MongoDB connection failed:", err.message);
        console.log("Retrying in 5 seconds...");
        // Retry connection after a 5-second delay.
        setTimeout(() => connectWithRetry(resolve), 5000);
    }
};

export { connectWithRetry };
