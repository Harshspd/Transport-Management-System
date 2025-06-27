import axiosInstance from '@/lib/axios'; // Adjust the import path if necessary
import { Vehicle } from '@/types/vehicle';

const API_ENDPOINT = '/vehicles/'; // Define the endpoint

export const getVehicles = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};

export const createVehicle = async (data:Vehicle) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINT,data);
        return response.data;
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        throw error;
    }
};