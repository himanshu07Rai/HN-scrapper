import { CONFIGS } from "@/config";
import cron from "node-cron";
import { axiosInstance } from "@/utils/axiosInstance";
import { parseHackerNewsHTML } from "@/utils/scrapperUtil";
import { pool } from "@/db";
import { Story } from "@/types";

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY = 6000; // 6 seconds

async function wait(ms: number | undefined) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeWithRetry(retryCount = 0): Promise<void> {
    try {
        const { data } = await axiosInstance.get(`${CONFIGS.HACKER_NEWS.NEWEST_URL}`);
        const stories = parseHackerNewsHTML(data);
        const sql = `
            INSERT INTO stories (title, url, posted_at, points, author)
            VALUES ?
            ON DUPLICATE KEY UPDATE title = VALUES(title), url = VALUES(url), posted_at = VALUES(posted_at), points = VALUES(points), author = VALUES(author)
        `;
        const values: (string | number | Date)[][] = stories.map((story: Story) => Object.values(story));
        const [result] = await pool.query(sql, [values]);
        console.log(`Saved ${JSON.stringify(result)} stories to the database.`);
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            console.error("::> Error scraping Hacker News", error);
            const delay = INITIAL_DELAY * Math.pow(2, retryCount);
            await wait(delay);
            return scrapeWithRetry(retryCount + 1);
        }
    }
}

const scrapeHackerNewsJob = cron.schedule(
    "*/5 * * * *", // run every 5 minutes
    () => scrapeWithRetry(),
    { scheduled: false, runOnInit: true }
);

export { scrapeHackerNewsJob };
