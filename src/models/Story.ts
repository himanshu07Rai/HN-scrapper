// src/models/Story.ts
import mongoose, { Schema, Document } from "mongoose";

// Define an interface representing a Story document in MongoDB.
export interface IStory extends Document {
    title: string;
    url: string;
    posted_at: Date;
    points: number;
    author: string;
}

// Create a Mongoose schema corresponding to the document interface.
const StorySchema: Schema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    posted_at: { type: Date, required: true },
    points: { type: Number, required: true },
    author: { type: String, required: true }
});

// Export the model based on the schema.
export default mongoose.model<IStory>("Story", StorySchema);
