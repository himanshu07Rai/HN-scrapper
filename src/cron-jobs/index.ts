import { CONFIGS } from "@/config";
import cron from "node-cron";
import { axiosInstance } from "@/utils/axiosInstance";
import { parseHackerNewsHTML } from "@/utils/scrapperUtil";
import { Story } from "@/types";
import { MAX_RETRIES, INITIAL_DELAY } from "@/utils/konstants";
import { app } from "@/index";
import StoryModel from "@/models/Story";

async function wait(ms: number | undefined) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeWithRetry(retryCount = 0): Promise<void> {
    try {
        const { data } = await axiosInstance.get(`${CONFIGS.HACKER_NEWS.NEWEST_URL}`);
        const stories = parseHackerNewsHTML(data);
        if (stories && stories.length > 0) {
            // Prepare bulk operations: update if exists (using URL as unique identifier), insert if not
            const bulkOps = stories.map((story: Story) => ({
                updateOne: {
                    filter: { url: story.url },
                    update: { $set: story },
                    upsert: true
                }
            }));
            const result = await StoryModel.bulkWrite(bulkOps);
            console.log(`Saved ${JSON.stringify(result)} stories to the database.`);
        }
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            console.error("::> Error scraping Hacker News", error);
            const delay = INITIAL_DELAY * Math.pow(2, retryCount);
            await wait(delay);
            return scrapeWithRetry(retryCount + 1);
        }
        console.error("::> Max retries reached. Could not scrape Hacker News.");
        app.emit("error", error);
    }
}

const scrapeHackerNewsJob = cron.schedule(
    "*/5 * * * *", // run every 5 minutes
    () => scrapeWithRetry(),
    { scheduled: false, runOnInit: true }
);

export { scrapeHackerNewsJob };
