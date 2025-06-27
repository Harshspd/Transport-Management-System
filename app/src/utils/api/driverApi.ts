import axiosInstance from '@/lib/axios'; // Adjust the import path if necessary
import { Driver } from '@/types/driver';

const API_ENDPOINT = '/drivers/'; // Define the endpoint

export const getDrivers = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};

export const createDriver = async (data:Driver) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINT,data);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};