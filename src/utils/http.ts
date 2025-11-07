import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './apiClient';

export const http = {
    get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response: AxiosResponse<T> = await apiClient.get(url, config);
        return response.data;
    },

    post: async <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
        const response: AxiosResponse<T> = await apiClient.post(url, data, config);
        return response.data;
    },

    put: async <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
        const response: AxiosResponse<T> = await apiClient.put(url, data, config);
        return response.data;
    },

    delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response: AxiosResponse<T> = await apiClient.delete(url, config);
        return response.data;
    }
};
