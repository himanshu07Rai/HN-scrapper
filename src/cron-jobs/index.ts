import { CONFIGS } from "@/config";
import cron from "node-cron";
import { axiosInstance } from "@/utils/axiosInstance";
import { parseHackerNewsHTML } from "@/utils/scrapperUtil";

const scrapeHackerNewsJob = cron.schedule(
    "*/5 * * * *", // run every 5 minutes
    async () => {
        try {
            const { data } = await axiosInstance.get(`${CONFIGS.HACKER_NEWS.NEWEST_URL}`);
            const stories = parseHackerNewsHTML(data);
            console.log(stories);
        } catch (error) {
            console.error("::> Error scraping Hacker News", error);
        }
    },
    { scheduled: false, runOnInit: true }
);

export { scrapeHackerNewsJob };
