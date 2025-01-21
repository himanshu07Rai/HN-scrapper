import * as cheerio from "cheerio";

function parseHackerNewsHTML(html: any) {
    const $ = cheerio.load(html);
    const stories: any = [];

    $(".athing").each((_: any, el: any) => {
        const title = $(el).find(".titleline a").text();
        const url = $(el).find(".titleline a").attr("href");
        const subtext = $(el).next().find(".subtext");
        const timeTitle = $(el).next().find(".age").attr("title")?.split(" ")[0];
        let mysqlDate = "";
        if (timeTitle) {
            mysqlDate = timeTitle.slice(0, 19).replace("T", " ");
        } else {
            mysqlDate = new Date().toISOString().slice(0, 19).replace("T", " ");
        }
        const points = subtext.find(".score").text() || "0 points";
        const author = subtext.find(".hnuser").text() || "Unknown";

        if (title && url) {
            stories.push({
                title,
                url,
                posted_at: mysqlDate,
                points: parseInt(points.split(" ")[0]!, 10),
                author
            });
        }
    });

    return stories;
}

export { parseHackerNewsHTML };
