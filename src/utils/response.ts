import { Response } from 'express';

export interface ApiResponse<T = undefined> {
    isSuccess: boolean;
    message?: string;
    data?: T;
}

export const sendSuccess = <T = undefined>(
    res: Response,
    data?: T,
    message?: string
): Response<ApiResponse<T>> => {
    const response: ApiResponse<T> = {
        isSuccess: true,
        message,
        data
    };
    return res.status(200).json(response);
};

export const sendError = <T = undefined>(
    res: Response,
    message: string,
    data?: T
): Response<ApiResponse<T>> => {
    const response: ApiResponse<T> = {
        isSuccess: false,
        message,
        data
    };
    return res.json(response);
};
