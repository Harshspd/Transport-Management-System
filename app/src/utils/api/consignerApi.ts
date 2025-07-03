import axiosInstance from '@/lib/axios'; // Adjust the import path if necessary
import { Consigner } from '@/types/consigner';

const API_ENDPOINT = '/consigners'; // Define the endpoint

export const getConsigners = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};

export const createConsigner = async (data: Consigner) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINT, data);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};
