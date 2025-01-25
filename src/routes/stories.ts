import { Router } from "express";

import { getAllStories } from "@/services/stories.service";
import { catcher } from "@/index";
// import { Request } from "express";
import logger from "@/utils/logger";

const router = Router();

console.log("Catcher function:", catcher);

// interface Story {
//     id: number;
//     title: string;
//     content: string;
//     // Add other fields as necessary
// }

// interface GetAllStoriesResponse {
//     stories: Story[];
// }

// interface Story {
//     id: number;
//     title: string;
//     content: string;
//     // Add other fields as necessary
// }

// interface GetAllStoriesResponse {
//     stories: Story[];
// }

interface CustomRequest extends Request {
    query: {
        page: number;
        limit: number;
    };
}

router.get(
    "/",
    catcher(async (req: CustomRequest, res: any) => {
        const { page, limit } = req.query;
        console.log({ page, limit });
        const stories: any = await getAllStories({ page, limit });
        logger.info(`Fetched ${JSON.stringify(stories.length)} stories from the database.`);
        res.json({ stories });
    })
);

export const storyRoutes = router;
