import axiosInstance from '@/lib/axios'; // Adjust the import path if necessary
import { Driver } from '@/types/driver';

const API_ENDPOINT = '/drivers'; // Define the endpoint

export const getDrivers = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching drivers:', error);
        throw error;
    }
};

export const createDriver = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINT, data);
        return response.data;
    } catch (error) {
        console.error('Error creating driver:', error);
        throw error;
    }
};

export const updateDriver = async (id: string, data: Driver) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINT + `/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};

export const getDriverById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT + `/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};
