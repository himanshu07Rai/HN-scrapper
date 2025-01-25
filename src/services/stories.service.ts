import StoryModel from "@/models/Story";
import { ObjectId } from "mongodb";

export const getAllStories = async ({ page, limit }: { page: number; limit: number }) => {
    // Fetch stories from the database
    const stories = StoryModel.find({})
        .sort({ posted_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    if (stories) {
        return stories;
    }
    return [];
};
