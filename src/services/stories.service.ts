import { pool } from "@/db";

export const getAllStories = async () => {
    const [rows] = await pool.query("SELECT * FROM stories");
    return rows;
};
