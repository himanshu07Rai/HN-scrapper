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
    // Add custom fields if necessary
}

router.get(
    "/",
    catcher(async (_: CustomRequest, res: any) => {
        const stories: any = await getAllStories();
        logger.info(`Fetched ${JSON.stringify(stories)} stories from the database.`);
        res.json({ stories });
    })
);

export const storyRoutes = router;
