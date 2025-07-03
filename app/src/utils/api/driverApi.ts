import axiosInstance from '@/lib/axios'; // Adjust the import path if necessary

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