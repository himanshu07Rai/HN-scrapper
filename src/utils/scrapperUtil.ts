import * as cheerio from "cheerio";
import { convertToMongoDate } from "./dateUtils";

function parseHackerNewsHTML(html: any) {
    const $ = cheerio.load(html);
    const stories: any = [];

    $(".athing").each((_: any, el: any) => {
        const title = $(el).find(".titleline a").text();
        const url = $(el).find(".titleline a").attr("href");
        const subtext = $(el).next().find(".subtext");
        const timeTitle = $(el).next().find(".age").attr("title")?.split(" ")[0];
        let mongoDate;
        if (timeTitle) {
            mongoDate = convertToMongoDate({ dateStr: timeTitle });
        } else {
            mongoDate = new Date();
        }
        const points = subtext.find(".score").text() || "0 points";
        const author = subtext.find(".hnuser").text() || "Unknown";

        if (title && url) {
            stories.push({
                title,
                url,
                posted_at: mongoDate,
                points: parseInt(points.split(" ")[0]!, 10),
                author
            });
        }
    });

    return stories;
}

export { parseHackerNewsHTML };
