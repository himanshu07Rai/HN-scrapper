import axios, { AxiosInstance } from "axios";
import https from "https";

// Create a custom Axios instance
const axiosInstance: AxiosInstance = axios.create({
    timeout: 10000, // Set timeout to 10 seconds
    httpsAgent: new https.Agent({ family: 4 }), // Force IPv4
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive"
    }
});

export { axiosInstance };
