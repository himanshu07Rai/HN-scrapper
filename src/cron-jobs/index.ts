import { CONFIGS } from "@/config";
import cron from "node-cron";
import { axiosInstance } from "@/utils/axiosInstance";
import { parseHackerNewsHTML } from "@/utils/scrapperUtil";
import { pool } from "@/db";
import { Story } from "@/types";

const scrapeHackerNewsJob = cron.schedule(
    "*/5 * * * *", // run every 5 minutes
    async () => {
        try {
            const { data } = await axiosInstance.get(`${CONFIGS.HACKER_NEWS.NEWEST_URL}`);
            const stories = parseHackerNewsHTML(data);
            console.log({ stories });
            const sql = `
                INSERT INTO stories (title, url, posted_at, points, author)
                VALUES ?
                ON DUPLICATE KEY UPDATE title = VALUES(title), url = VALUES(url), posted_at = VALUES(posted_at), points = VALUES(points), author = VALUES(author)
            `;
            const values: (string | number | Date)[][] = stories.map((story: Story) => Object.values(story));
            const [result] = await pool.query(sql, [values]);
            console.log(`Saved ${JSON.stringify(result)} stories to the database.`);
        } catch (error) {
            console.error("::> Error scraping Hacker News", error);
        }
    },
    { scheduled: false, runOnInit: true }
);

export { scrapeHackerNewsJob };
