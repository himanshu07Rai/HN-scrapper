/**
 * Convert an ISO 8601 date string into a MongoDB-compatible Date object.
 *
 * @param {string} dateStr - A date string in ISO 8601 format (e.g., '2025-02-01T15:44:52').
 *                            If the string does not include a timezone designator,
 *                            we assume it represents a UTC time by appending 'Z'.
 * @returns {Date} - A JavaScript Date object suitable for storage in MongoDB.
 */
interface ConvertToMongoDateOptions {
    dateStr: string;
}

export function convertToMongoDate({ dateStr }: ConvertToMongoDateOptions): Date {
    // Check if the date string ends with 'Z' (indicating UTC).
    // If not, append 'Z' to treat the time as UTC.
    if (!dateStr.endsWith("Z")) {
        dateStr += "Z";
    }
    // Create and return the Date object.
    return new Date(dateStr);
}

/**
 * Convert a MongoDB stored Date (which is in UTC) to a string formatted in Indian Standard Time (IST).
 *
 * @param {Date} dateObj - A Date object (typically retrieved from MongoDB, stored as UTC).
 * @returns {string} - A string representing the date and time in IST.
 */
interface ConvertToISTOptions {
    timeZone: string;
    year: "numeric" | "2-digit";
    month: "numeric" | "2-digit";
    day: "numeric" | "2-digit";
    hour: "numeric" | "2-digit";
    minute: "numeric" | "2-digit";
    second: "numeric" | "2-digit";
    hour12: boolean;
}

export function convertToIST(dateObj: Date): string {
    // Define formatting options for IST.
    const options: ConvertToISTOptions = {
        timeZone: "Asia/Kolkata", // IST timezone
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false // 24-hour format
    };

    // Convert the date object to a locale string using the IST timezone.
    return dateObj.toLocaleString("en-GB", options);
}
