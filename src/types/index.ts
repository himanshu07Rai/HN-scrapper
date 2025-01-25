import { Request, Response, NextFunction } from "express";

export interface Story {
    title: string;
    url: string;
    posted_at: Date;
    points: number;
    author: string;
}

export interface ApiError extends Error {
    status?: number;
    meta?: any;
    code?: string;
}

export interface ApiErrorHandler {
    (err: ApiError, req: Request, res: Response, next: NextFunction): void;
}
